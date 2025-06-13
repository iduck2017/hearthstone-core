import { Model, Props, StoreService } from "set-piece";

export namespace RootModel {
    export type State = {};
    export type Event = {};
    export type Child = {};
    export type Refer = {};
}


@StoreService.is('root')
export class RootModel extends Model<
    Model,
    RootModel.Event, 
    RootModel.State, 
    RootModel.Child,
    RootModel.Refer
> {
    constructor(props: Props<
        RootModel.State, 
        RootModel.Child, 
        RootModel.Refer
    >) {
        super({
            state: {},
            child: {},
            refer: {},
        });
    }
}