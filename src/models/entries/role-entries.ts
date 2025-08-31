import { Model, StoreUtil } from "set-piece";
import { ChargeModel } from "./charge";
import { DivineSheildModel } from "./divine-shield";
import { RushModel, RushStatus } from "./rush";
import { FrozenModel } from "./frozen";
import { StealthModel } from "./stealth";
import { TauntModel } from "./taunt";
import { WindfuryModel, WindfuryStatus } from "./windfury";
import { SpellDamageModel } from "./spell-damage";
import { ElusiveModel } from "./elusive";
import { FeatureStatus } from "../features";

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
        readonly spellDamage: SpellDamageModel;
        readonly divineShield: DivineSheildModel;
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
    constructor(props: RoleEntriesModel['props']) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { 
                rush: props.child?.rush ?? new RushModel({ state: { status: RushStatus.INACTIVE }}),
                taunt: props.child?.taunt ?? new TauntModel({ state: { status: FeatureStatus.INACTIVE }}),
                charge: props.child?.charge ?? new ChargeModel({ state: { status: FeatureStatus.INACTIVE }}),
                frozen: props.child?.frozen ?? new FrozenModel({ state: { status: FeatureStatus.INACTIVE }}),
                elusive: props.child?.elusive ?? new ElusiveModel({ state: { status: FeatureStatus.INACTIVE }}),
                stealth: props.child?.stealth ?? new StealthModel({ state: { status: FeatureStatus.INACTIVE }}),
                windfury: props.child?.windfury ?? new WindfuryModel({ state: { status: WindfuryStatus.INACTIVE }}),
                spellDamage: props.child?.spellDamage ?? new SpellDamageModel({ state: { origin: 0, status: FeatureStatus.INACTIVE }}),
                divineShield: props.child?.divineShield ?? new DivineSheildModel({ state: { count: 0, status: FeatureStatus.INACTIVE }}),
                ...props.child 
            },
            refer: { ...props.refer }
        });
    }
}