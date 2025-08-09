import { Model } from "set-piece";
import { RoleModel } from "..";
import { DevineSheildModel } from "./devine-sheild";
import { WindfuryModel } from "./windfury";
import { TauntModel } from "./taunt";

export namespace RoleEntriesModel {
    export type State = {};
    export type Event = {};
    export type Child = {
        devineSheild: DevineSheildModel;
        windfury: WindfuryModel;
        taunt: TauntModel;
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
                taunt: new TauntModel({}),
                windfury: new WindfuryModel({}),
                devineSheild: new DevineSheildModel({}),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
}