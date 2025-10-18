import { DeathrattleModel } from "../../..";
import { StartTurnHookModel } from "../../..";
import { EndTurnHookModel } from "../../..";
import { WeaponBattlecryModel } from "../../..";
import { CardFeaturesModel } from "./card";
import { FeatureModel } from "..";
import { Model, TemplUtil } from "set-piece";

export namespace WeaponFeaturesModel {
    export type E = {};
    export type S = {};
    export type C = {
        readonly endTurn: EndTurnHookModel[];
        readonly startTurn: StartTurnHookModel[];
        readonly battlecry: WeaponBattlecryModel[];
        readonly deathrattle: DeathrattleModel[];
    };
    export type R = {};
}

export type WeaponHooksOptions = {
    battlecry: Map<WeaponBattlecryModel, Model[]>
}

@TemplUtil.is('card-hooks')
export class WeaponFeaturesModel extends CardFeaturesModel<
    WeaponFeaturesModel.E,
    WeaponFeaturesModel.S,
    WeaponFeaturesModel.C,
    WeaponFeaturesModel.R
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

    constructor(props?: WeaponFeaturesModel['props']) {
        super({
            uuid: props?.uuid,
            state: { ...props?.state },
            child: { 
                endTurn: [],
                startTurn: [],
                battlecry: [],
                deathrattle: [],
                ...props?.child 
            },
            refer: { ...props?.refer },
        });
    }

    protected query(feat: FeatureModel): FeatureModel[] | undefined {
        if (feat instanceof WeaponBattlecryModel) return this.origin.child.battlecry;
        if (feat instanceof DeathrattleModel) return this.origin.child.deathrattle;
        if (feat instanceof StartTurnHookModel) return this.origin.child.startTurn;
        if (feat instanceof EndTurnHookModel) return this.origin.child.endTurn;
        return this.origin.child.feats;
    }
}