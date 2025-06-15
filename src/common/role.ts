import { Model, Props } from "set-piece";

export namespace RoleModel {
    export type State = {
        readonly attack: number;
        readonly health: number;
        lostHealth: number;
    };
    export type Event = {};
    export type Child = {};
    export type Refer = {};
}

export class RoleModel<
    P extends Model = Model,
    E extends Partial<RoleModel.Event> & Model.Event = Partial<RoleModel.Event>,
    S extends Partial<RoleModel.State> & Model.State = Partial<RoleModel.State>,
    C extends Partial<RoleModel.Child> & Model.Child = Partial<RoleModel.Child>,
    R extends Partial<RoleModel.Refer> & Model.Refer = Partial<RoleModel.Refer>
> extends Model<
    P,
    RoleModel.Event & E,
    RoleModel.State & S,
    RoleModel.Child & C,
    RoleModel.Refer & R
> {
    public constructor(props: Props<
        RoleModel.State,
        RoleModel.Child,
        RoleModel.Refer
    > & {
        state: S & {
            readonly attack: number;
            readonly health: number;
        };
        child: C;
        refer: R;
    }) {
        super({
            uuid: props.uuid,
            state: {
                lostHealth: 0,
                ...props.state 
            },
            child: { ...props.child },
            refer: { ...props.refer },
        })
    }

    
    attack() {

    }
}