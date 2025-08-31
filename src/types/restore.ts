import { Event } from "set-piece";
import { RoleModel } from "../models/role";
import { RestoreModel } from "../models/actions/restore";

export class RestoreEvent extends Event<{
    target: RoleModel;
    source: RestoreModel;
    origin: number;
    result: number;
}> {
    constructor(props: {
        target: RoleModel;
        source: RestoreModel;
        origin: number;
    }) {
        super({
            ...props,
            result: props.origin,
        });
    }

    public reset(number: number) {
        this._detail.result = number;
    }
}