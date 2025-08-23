import { Model } from "set-piece";
import { ChargeModel } from "../entries/charge";
import { DivineSheildModel } from "../entries/divine-shield";
import { RushModel } from "../entries/rush";
import { FrozenModel } from "../entries/frozen";
import { StealthModel } from "../entries/stealth";
import { TauntModel } from "../entries/taunt";
import { WindfuryModel } from "../entries/windfury";

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
                rush: new RushModel({}),
                charge: new ChargeModel({}),
                frozen: new FrozenModel({}),
                stealth: new StealthModel({}),
                taunt: new TauntModel({}),
                windfury: new WindfuryModel({}),
                divineShield: new DivineSheildModel({}),
                ...props.child 
            },
            refer: { ...props.refer }
        });
    }
}