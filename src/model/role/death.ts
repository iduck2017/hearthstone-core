import { Callback, Model, TranxUtil } from "set-piece";
import { RoleModel } from ".";
import { DamageForm, DamageModel } from "../card/damage";

export namespace DeathModel {
    export type Event = {
        onDie: {};
    };
    export type State = {
        isDead: boolean;
        isDestroyed: boolean;
        damage?: number;
    };
    export type Child = {};
    export type Refer = {
        reason?: DamageModel
    };
}

export class DeathModel extends Model<
    DeathModel.Event,
    DeathModel.State,
    DeathModel.Child,
    DeathModel.Refer
> {
    private static _isLock = false;
    public static get isLock() {
        return DeathModel._isLock;
    }

    private static tasks: Array<RoleModel> = [];

    public static span() {
        return function(
            prototype: unknown,
            key: string,
            descriptor: TypedPropertyDescriptor<Callback>
        ): TypedPropertyDescriptor<Callback> {
            const handler = descriptor.value;
            if (!handler) return descriptor;
            const instance = {
                [key](this: unknown, ...args: any[]) {
                    if (DeathModel._isLock) {
                        return handler.call(this, ...args);
                    }
                    DeathModel._isLock = true;
                    const result = handler.call(this, ...args);
                    if (result instanceof Promise) {
                        result.then(() => {
                            DeathModel._isLock = false;
                            DeathModel.end();
                        })
                    } else {
                        DeathModel._isLock = false;
                        DeathModel.end();
                    }
                    return result;
                }
            }
            descriptor.value = instance[key];
            return descriptor;
        }
    }

    public static end() {
        const tasks = DeathModel.tasks;
        DeathModel.tasks = [];
    }

    @TranxUtil.span()
    private static _dispose(tasks: RoleModel[]) {
        tasks.forEach(role => role.route.card?.remove());
        tasks.forEach(role => role.child.death.event.onDie({}));
    }

    public get route() {
        const path = super.route.path;
        const role: RoleModel | undefined = path.find(item => item instanceof RoleModel);
        return { ...super.route, role }
    }

    constructor(props: DeathModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                isDead: false,
                isDestroyed: false,
                ...props.state,
            },
            child: {},
            refer: {},
        })
    }

    public check(cmd: DamageForm) {
        if (cmd.target !== this.route.role) return false;
        this.draft.state.damage = cmd.result;
        this.draft.state.isDead = true;
        this.draft.refer.reason = cmd.source;
        DeathModel.tasks.push(this.route.role);
        return true;
    }
}