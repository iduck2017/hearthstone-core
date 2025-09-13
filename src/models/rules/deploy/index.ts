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
    E extends Partial<DeployProps.E> & Props.E = {},
    S extends Partial<DeployProps.S> & Props.S = {},
    C extends Partial<DeployProps.C> & Props.C = {},
    R extends Partial<DeployProps.R> & Props.R = {},
    P extends Partial<DeployProps.P> & Props.P = {}
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
        route: P;
    }, []>) {
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