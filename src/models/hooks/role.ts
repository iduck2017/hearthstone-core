import { Loader, Model } from "set-piece";
import { ROLE_ROUTE, RoleRoute } from "../..";
import { OverhealModel } from "./overheal";

export namespace RoleHooksProps {
    export type E = {};
    export type S = {};
    export type C = {
        readonly overheal: OverhealModel[];
    };
    export type R = {};
    export type P = RoleRoute;
}

export class RoleHooksModel extends Model<
    RoleHooksProps.E,
    RoleHooksProps.S,
    RoleHooksProps.C,
    RoleHooksProps.R,
    RoleHooksProps.P
> {
    constructor(loader?: Loader<RoleHooksModel>) {
        super(() => {
            const props = loader?.() ?? {}; 
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: {
                    overheal: [],
                    ...props.child,
                },
                refer: { ...props.refer },
                route: ROLE_ROUTE,
            }
        });
    }
}