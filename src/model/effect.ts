import { Model } from "set-piece";
import { RoleModel } from "./role";

export namespace EffectModel {
    export type State = {}
    export type Event = {};
    export type Child = {};
    export type Refer = {};
}

export abstract class EffectModel<
    E extends Partial<EffectModel.Event> & Model.Event = {},
    S extends Partial<EffectModel.State> & Model.State = {},
    C extends Partial<EffectModel.Child> & Model.Child = {},
    R extends Partial<EffectModel.Refer> & Model.Refer = {}
> extends Model<
    E & EffectModel.Event,
    S & EffectModel.State,
    C & EffectModel.Child,
    R & EffectModel.Refer
> {
    constructor(props: EffectModel['props'] & {
        uuid: string | undefined;
        state: S
        child: C,
        refer: R,
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        })
    }

    public get route(): Readonly<Partial<{
        role: RoleModel;
        root: Model;
        parent: Model;
    }>>{
        const parent = super.route.parent;
        const role = parent instanceof RoleModel ? parent : undefined;
        return {
            ...super.route,
            role,   
        }
    }

    protected abstract check(): boolean;
}