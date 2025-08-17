import { Model } from "set-piece";
import { CardModel } from "../card";
import { RoleModel } from ".";

export namespace ActionModel {
    export type State = {
        count: number;
    };
    export type Event = {};
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
        const route = super.route;
        const role: RoleModel | undefined = route.path.find(item => item instanceof RoleModel);
        const card: CardModel | undefined = route.path.find(item => item instanceof CardModel);
        return { ...route, role, card }
    }

    constructor(props: ActionModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                count: 0,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public reset() {
        const role = this.route.role;
        if (!role) return;
        const windfury = role.child.windfury;
        this.draft.state.count = 1 + windfury.state.level;
    }

    public use() {
        if (this.state.count <= 0) return false;
        this.draft.state.count --;
        return true;
    }
}