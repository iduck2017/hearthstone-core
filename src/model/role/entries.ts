import { Model } from "set-piece";
import { ChargeModel } from "../entries/charge";
import { DivineSheildModel } from "../entries/divine-shield";
import { RushModel, RushStatus } from "../entries/rush";
import { FrozenModel } from "../entries/frozen";
import { StealthModel } from "../entries/stealth";
import { TauntModel } from "../entries/taunt";
import { WindfuryModel, WindfuryStatus } from "../entries/windfury";

export namespace RoleEntriesModel {
    export type Event = {};
    export type State = {};
    export type Child = {
        readonly rush: RushModel;
        readonly charge: ChargeModel;
        readonly frozen: FrozenModel;
        readonly stealth: StealthModel;
        readonly taunt: TauntModel;
        readonly windfury: WindfuryModel;
        readonly divineShield: DivineSheildModel;
    };
    export type Refer = {};
}

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
                stealth: new StealthModel({ state: { status: 0 }}),
                windfury: new WindfuryModel({ state: { status: WindfuryStatus.INACTIVE }}),
                divineShield: new DivineSheildModel({ state: { count: 0, status: 0 }}),
                ...props.child 
            },
            refer: { ...props.refer }
        });
    }
}