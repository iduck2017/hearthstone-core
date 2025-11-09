import { PoisonousModel } from "../entries/poisonous";
import { FeatureModel } from "..";
import { Model } from "set-piece";
import { TauntModel } from "../entries/taunt";
import { FrozenModel } from "../entries/frozen";
import { StealthModel } from "../entries/stealth";
import { ElusiveModel } from "../entries/elusive";
import { WindfuryModel } from "../entries/windfury";
import { DivineShieldModel } from "../entries/divine-shield";
import { IRoleBuffModel, OverhealModel } from "../../..";
import { HeroModel } from "../../heroes";
import { MinionCardModel } from "../../cards/minion";

export type RoleModel = HeroModel | MinionCardModel;

export namespace HeroFeaturesModel {
    export type E = {};
    export type S = {};
    export type C = {
        // entries
        readonly taunt: TauntModel;
        readonly frozen: FrozenModel;
        readonly stealth: StealthModel;
        readonly elusive: ElusiveModel;
        readonly windfury: WindfuryModel;
        readonly divineShield: DivineShieldModel;
        readonly poisonous: PoisonousModel;
        // feats
        readonly buffs: IRoleBuffModel[];
        readonly items: FeatureModel[];
        // hooks
        readonly overheal: OverhealModel[];
    };
    export type R = {};
}

export class HeroFeaturesModel extends Model<
    HeroFeaturesModel.E,
    HeroFeaturesModel.S,
    HeroFeaturesModel.C,
    HeroFeaturesModel.R
> {
    public get chunk() {
        const feats = this.child.items.map(item => item.chunk).filter(Boolean);
        return {
            poisonous: this.child.poisonous.chunk || undefined,
            feats: feats.length ? feats : undefined,
        }
    }

    constructor(props?: HeroFeaturesModel['props']) {
        super({
            uuid: props?.uuid,
            state: { ...props?.state },
            refer: { ...props?.refer },
            child: { 
                buffs: [],
                items: [],
                overheal: [],
                taunt: props?.child?.taunt ?? new TauntModel({ state: { isActive: false }}),
                frozen: props?.child?.frozen ?? new FrozenModel({ state: { isActive: false }}),
                stealth: props?.child?.stealth ?? new StealthModel({ state: { isActive: false }}),
                elusive: props?.child?.elusive ?? new ElusiveModel({ state: { isActive: false }}),
                windfury: props?.child?.windfury ?? new WindfuryModel({ state: { isActive: false }}),
                divineShield: props?.child?.divineShield ?? new DivineShieldModel({ state: { isActive: false }}),
                poisonous: props?.child?.poisonous ?? new PoisonousModel({ state: { isActive: false }}),
                ...props?.child 
            },
        });
    }

    protected query(feat: FeatureModel): FeatureModel[] | undefined {
        return this.origin.child.items;
    }
}