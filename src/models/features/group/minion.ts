import { Model, TemplUtil } from "set-piece";
import { ChargeModel, DivineShieldModel, ElusiveModel, FeatureModel, FrozenModel, IRoleBuffModel, MinionBattlecryModel, MinionFeatureModel, OverhealModel, RushModel, StealthModel, TauntModel, WindfuryModel } from "../../..";
import { DeathrattleModel } from "../../..";
import { StartTurnHookModel } from "../../..";
import { EndTurnHookModel } from "../../..";
import { CardFeaturesModel } from "./card";

export namespace MinionFeaturesModel {
    export type E = {};
    export type S = {};
    export type C = {
        readonly rush: RushModel;
        readonly taunt: TauntModel;
        readonly charge: ChargeModel;
        readonly frozen: FrozenModel;
        readonly stealth: StealthModel;
        readonly elusive: ElusiveModel;
        readonly windfury: WindfuryModel;
        readonly divineShield: DivineShieldModel;
        // feats
        readonly buffs: IRoleBuffModel[];
        // hooks
        readonly overheal: OverhealModel[];
        readonly endTurn: EndTurnHookModel[];
        readonly startTurn: StartTurnHookModel[];
        readonly battlecry: MinionBattlecryModel[];
        readonly deathrattle: DeathrattleModel[];
    };
    export type R = {};
}

export type MinionHooksConfig = {
    battlecry: Map<MinionBattlecryModel, Model[]>
}

@TemplUtil.is('card-hooks')
export class MinionFeaturesModel extends CardFeaturesModel<
    MinionFeaturesModel.E,
    MinionFeaturesModel.S,
    MinionFeaturesModel.C,
    MinionFeaturesModel.R
> {
    public get chunk() {
        const result = super.chunk;
        const endTurn = this.child.endTurn.map(item => item.chunk).filter(Boolean);
        const startTurn = this.child.startTurn.map(item => item.chunk).filter(Boolean);
        const battlecry = this.child.battlecry.map(item => item.chunk).filter(Boolean);
        const deathrattle = this.child.deathrattle.map(item => item.chunk).filter(Boolean);
        return {
            ...result,
            endTurn: endTurn.length ? endTurn : undefined,
            startTurn: startTurn.length ? startTurn : undefined,
            battlecry: battlecry.length ? battlecry : undefined,
            deathrattle: deathrattle.length ? deathrattle : undefined,
        }
    }

    constructor(props?: MinionFeaturesModel['props']) {
        super({
            uuid: props?.uuid,
            state: { ...props?.state },
            child: { 
                buffs: [],
                items: [],
                endTurn: [],
                startTurn: [],
                battlecry: [],
                deathrattle: [],
                overheal: [],
                rush: props?.child?.rush ?? new RushModel({ state: { isActive: false }}),
                taunt: props?.child?.taunt ?? new TauntModel({ state: { isActive: false }}),
                charge: props?.child?.charge ?? new ChargeModel({ state: { isActive: false }}),
                frozen: props?.child?.frozen ?? new FrozenModel({ state: { isActive: false }}),
                stealth: props?.child?.stealth ?? new StealthModel({ state: { isActive: false }}),
                elusive: props?.child?.elusive ?? new ElusiveModel({ state: { isActive: false }}),
                windfury: props?.child?.windfury ?? new WindfuryModel({ state: { isActive: false }}),
                divineShield: props?.child?.divineShield ?? new DivineShieldModel({ state: { isActive: false }}),
                ...props?.child 
            },
            refer: { ...props?.refer },
        });
    }

    protected query(feat: FeatureModel): FeatureModel[] | undefined {
        if (feat instanceof MinionBattlecryModel) return this.origin.child.battlecry;
        if (feat instanceof DeathrattleModel) return this.origin.child.deathrattle;
        if (feat instanceof StartTurnHookModel) return this.origin.child.startTurn;
        if (feat instanceof EndTurnHookModel) return this.origin.child.endTurn;
        return this.origin.child.items;
    }

    public add(feat: FeatureModel) {
        let feats = this.query(feat);
        if (!feats) return;
        feats.push(feat);
    }

    public del(feat: FeatureModel) {
        let feats = this.query(feat);
        if (!feats) return;
        const index = feats.indexOf(feat);
        if (index == -1) return;
        feats.splice(index, 1);
    }
}