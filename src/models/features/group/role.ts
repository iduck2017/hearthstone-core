import { ChargeModel } from "../entries/charge";
import { DivineShieldModel } from "../entries/divine-shield";
import { RushModel } from "../entries/rush";
import { FrozenModel } from "../entries/frozen";
import { StealthModel } from "../entries/stealth";
import { TauntModel } from "../entries/taunt";
import { WindfuryModel } from "../entries/windfury";
import { ElusiveModel } from "../entries/elusive";
import { OverhealModel } from "../hooks/overheal";
import { IRoleBuffModel, RoleFeatureModel } from "../../..";
import { FeatureModel } from "../../..";
import { Model, TemplUtil } from "set-piece";

export namespace RoleFeaturesModel {
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
        readonly overheal: OverhealModel[];
        // feats
        readonly buffs: IRoleBuffModel[];
        readonly feats: RoleFeatureModel[];
    };
    export type R = {};
}

@TemplUtil.is('role-entries')
export class RoleFeaturesModel extends Model<
    RoleFeaturesModel.E,
    RoleFeaturesModel.S,
    RoleFeaturesModel.C,
    RoleFeaturesModel.R
> {
    constructor(props?: RoleFeaturesModel['props']) {
        const child = props?.child ?? {};
        super({
            uuid: props?.uuid,
            state: { ...props?.state },
            child: { 
                rush: child.rush ?? new RushModel({ state: { isActive: false }}),
                taunt: child.taunt ?? new TauntModel({ state: { isActive: false }}),
                charge: child.charge ?? new ChargeModel({ state: { isActive: false }}),
                frozen: child.frozen ?? new FrozenModel({ state: { isActive: false }}),
                elusive: child.elusive ?? new ElusiveModel({ state: { isActive: false }}),
                stealth: child.stealth ?? new StealthModel({ state: { isActive: false }}),
                windfury: child.windfury ?? new WindfuryModel({ state: { isActive: false }}),
                divineShield: child.divineShield ?? new DivineShieldModel({ state: { isActive: false }}),
                overheal: child.overheal ?? [],
                buffs: child.buffs ?? [],
                feats: child.feats ?? [],
                ...props?.child 
            },
            refer: { ...props?.refer },
        });
    }

    protected query(feat: FeatureModel): FeatureModel[] | undefined {
        if (feat instanceof IRoleBuffModel) return this.origin.child.buffs;
        return this.origin.child.feats;
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