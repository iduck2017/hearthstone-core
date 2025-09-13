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
    P extends Partial<DeployProps.P> & Props.P = {}
> extends Model<
    DeployProps.E,
    DeployProps.S,
    DeployProps.C,
    DeployProps.R,
    P & DeployProps.P
> {
    constructor(loader: Method<DeployModel['props'] & {
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