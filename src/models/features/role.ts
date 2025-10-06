import { Loader, Model, StoreUtil } from "set-piece";
import { ChargeModel } from "../entries/charge";
import { DivineShieldModel } from "../entries/divine-shield";
import { RushModel } from "../entries/rush";
import { FrozenModel } from "../entries/frozen";
import { StealthModel } from "../entries/stealth";
import { TauntModel } from "../entries/taunt";
import { WindfuryModel } from "../entries/windfury";
import { ElusiveModel } from "../entries/elusive";
import { OverhealModel } from "../hooks/overheal";
import { IRoleBuffModel } from "./buff/role";
import { FeatureModel } from ".";

export namespace RoleFeatsProps {
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
        readonly items: FeatureModel[];
    };
    export type R = {};
}

@StoreUtil.is('role-entries')
export class RoleFeatsModel extends Model<
    RoleFeatsProps.E,
    RoleFeatsProps.S,
    RoleFeatsProps.C,
    RoleFeatsProps.R
> {
    constructor(loader?: Loader<RoleFeatsModel>) {
        super(() => {
            const props = loader?.() ?? {};
            const child = props.child ?? {};
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: { 
                    rush: child.rush ?? new RushModel(() => ({ state: { isActive: false }})),
                    taunt: child.taunt ?? new TauntModel(() => ({ state: { isActive: false }})),
                    charge: child.charge ?? new ChargeModel(() => ({ state: { isActive: false }})),
                    frozen: child.frozen ?? new FrozenModel(() => ({ state: { isActive: false }})),
                    elusive: child.elusive ?? new ElusiveModel(() => ({ state: { isActive: false }})),
                    stealth: child.stealth ?? new StealthModel(() => ({ state: { isActive: false }})),
                    windfury: child.windfury ?? new WindfuryModel(() => ({ state: { isActive: false }})),
                    divineShield: child.divineShield ?? new DivineShieldModel(() => ({ state: { isActive: false }})),
                    overheal: child.overheal ?? [],
                    buffs: child.buffs ?? [],
                    items: child.items ?? [],
                    ...props.child 
                },
                refer: { ...props.refer },
                route: {},
            }
        });
    }

    protected query(feat: FeatureModel): FeatureModel[] | undefined {
        if (feat instanceof IRoleBuffModel) return this.draft.child.buffs;
        return this.draft.child.items;
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