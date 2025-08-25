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

export namespace RoleEntriesModel {
    export type Event = {};
    export type State = {};
    export type Child = {
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
    export type Refer = {};
}

@StoreUtil.is('role-entries')
export class RoleEntriesModel extends Model<
    RoleEntriesModel.Event,
    RoleEntriesModel.State,
    RoleEntriesModel.Child,
    RoleEntriesModel.Refer
> {
    constructor(props: RoleEntriesModel['props']) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { 
                rush: new RushModel({ state: { status: RushStatus.INACTIVE }}),
                taunt: new TauntModel({ state: { status: 0 }}),
                charge: new ChargeModel({ state: { status: 0 }}),
                frozen: new FrozenModel({ state: { status: 0 }}),
                elusive: new ElusiveModel({ state: { status: 0 }}),
                stealth: new StealthModel({ state: { status: 0 }}),
                windfury: new WindfuryModel({ state: { status: WindfuryStatus.INACTIVE }}),
                spellDamage: new SpellDamageModel({ state: { origin: 0, status: 0 }}),
                divineShield: new DivineSheildModel({ state: { count: 0, status: 0 }}),
                ...props.child 
            },
            refer: { ...props.refer }
        });
    }
}