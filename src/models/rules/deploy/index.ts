import { Event, Loader, Model } from "set-piece"
import { BoardModel } from "../../containers/board"

export namespace DeployProps {
    export type E = {
        toRun: Event;
        onRun: Event;
    }
    export type S = {}
    export type C = {}
    export type R = {}
}


export abstract class DeployModel extends Model<
    DeployProps.E,
    DeployProps.S,
    DeployProps.C,
    DeployProps.R
> {
    constructor(loader: Loader<DeployModel>) {
        super(() => {
            const props = loader() ?? {}
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: { ...props.child },
                refer: { ...props.refer }
            }
        })
    }

    public abstract run(board?: BoardModel): void
}