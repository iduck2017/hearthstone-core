import { Model } from "set-piece";
import { DamageCmd } from "./damage";
import { RoleModel } from "./role";
import { FilterType } from "../types";

export namespace DevineSheildModel {
    export type State = {
        isActive: boolean;
        name: string;
        desc: string;
    };
    export type Event = {
        onUse: DamageCmd;
        onGet: {};
    };
    export type Refer = {};
    export type Child = {};
}

export class DevineSheildModel extends Model<
    DevineSheildModel.Event,
    DevineSheildModel.State,
    DevineSheildModel.Child,
    DevineSheildModel.Refer
> {
    constructor(props: DevineSheildModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                isActive: false,
                name: "Devine Shield",
                desc: "The first time this takes damage, ignore it.",
                ...props.state,
            },
            child: {},
            refer: {}
        })
    }

    public get route(): Model['route'] & Readonly<Partial<{
        role: RoleModel;
    }>> {
        const parent = super.route.parent;
        const role = parent instanceof RoleModel ? parent : undefined;
        return {
            ...super.route,
            role,
        }
    }

    public check(cmd: DamageCmd): boolean {
        if (!this.state.isActive) return false;
        if (!this.route.role?.check({
            isAlive: FilterType.INCLUDE,
            onBoard: FilterType.INCLUDE
        })) return false;
        this.draft.state.isActive = false;
        this.event.onUse(cmd);
        return true;
    }

    public get() {
        this.draft.state.isActive = true;
        this.event.onGet({});
    }
}