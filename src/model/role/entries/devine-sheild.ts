import { Model } from "set-piece";
import { DamageForm } from "../../card/damage";
import { RoleModel } from "..";
import { FilterType } from "../../../types";

export namespace DevineSheildModel {
    export type State = {
        readonly name: string;
        readonly desc: string;
        isActive: boolean;
    };
    export type Event = {
        onUse: DamageForm;
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
    public get route(): Model['route'] & Readonly<Partial<{
        role: RoleModel;
    }>> {
        const parent = super.route.parent;
        const role = parent instanceof RoleModel ? parent : undefined;
        return { ...super.route, role }
    }

    constructor(props: DevineSheildModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: "Devine Shield",
                desc: "The first time this takes damage, ignore it.",
                isActive: false,
                ...props.state,
            },
            child: {},
            refer: {}
        })
    }


    public check(cmd: DamageForm): boolean {
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