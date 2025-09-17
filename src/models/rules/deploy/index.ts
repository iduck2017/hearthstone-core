import { Event, Loader, Method, Model, Props } from "set-piece"
import { BoardModel } from "../../containers/board"
import { PlayerModel } from "../../.."

export namespace DeployProps {
    export type E = {
        toRun: Event;
        onRun: Event;
    }
    export type S = {}
    export type C = {}
    export type R = {}
    export type P = {
        player: PlayerModel;
    }
}

export abstract class DeployModel<
    E extends Props.E = {},
    S extends Props.S = {},
    C extends Props.C = {},
    R extends Props.R = {},
    P extends Props.P = {},
> extends Model<
    E & DeployProps.E,
    S & DeployProps.S,
    C & DeployProps.C,
    R & DeployProps.R,
    P & DeployProps.P
> {
    constructor(loader: Method<DeployModel['props'] & {
        state: S,
        child: C,
        refer: R,
        route: P,
    }>) {
        super(() => {
            const props = loader() ?? {}
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: { ...props.child },
                refer: { ...props.refer },
                route: {
                    player: PlayerModel.prototype,
                    ...props.route,
                },
            }
        })
    }

    public abstract run(board?: BoardModel): void
}