import { Model } from "set-piece";
import { RoleModel } from ".";

export namespace ActionModel {
    export type Event = {};
    export type State = {
        current: number;
    };
    export type Child = {};
    export type Refer = {};
}

export class ActionModel extends Model<
    ActionModel.Event,
    ActionModel.State,
    ActionModel.Child,
    ActionModel.Refer
> {
    public get route() {
        const path = super.route.path;
        const role: RoleModel | undefined = path.find(item => item instanceof RoleModel);
        return { ...super.route, role }
    }

    constructor(props: ActionModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                current: 0,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public reset() {
        const role = this.route.role;
        if (!role) return;
        const windfury = role.child.entries.child.windfury;
        this.draft.state.current = 1 + windfury.use();
    }

    public use() {
        if (this.state.current <= 0) return false;
        this.draft.state.current --;
        return true;
    }
}