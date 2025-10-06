import { Loader, Model, StoreUtil } from "set-piece";
import { ChargeModel } from "./charge";
import { DivineShieldModel } from "./divine-shield";
import { RushModel } from "./rush";
import { FrozenModel } from "./frozen";
import { StealthModel } from "./stealth";
import { TauntModel } from "./taunt";
import { WindfuryModel } from "./windfury";
import { ElusiveModel } from "./elusive";
import { PoisonousModel } from "./poisonous";
import { OverhealModel } from "../hooks/overheal";

export namespace RoleEntriesProps {
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
    };
    export type R = {};
}

@StoreUtil.is('role-entries')
export class RoleEntriesModel extends Model<
    RoleEntriesProps.E,
    RoleEntriesProps.S,
    RoleEntriesProps.C,
    RoleEntriesProps.R
> {
    constructor(loader?: Loader<RoleEntriesModel>) {
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
                    ...props.child 
                },
                refer: { ...props.refer },
                route: {},
            }
        });
    }
}