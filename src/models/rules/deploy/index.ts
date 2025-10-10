import { Event, Method, Model } from "set-piece"
import { BoardModel } from "../../board"
import { PlayerModel } from "../../.."

export namespace DeployModel {
    export type E = {
        toRun: Event;
        onRun: Event;
    }
    export type S = {}
    export type C = {}
    export type R = {}
}

export abstract class DeployModel<
    E extends Partial<DeployModel.E> & Model.E = {},
    S extends Partial<DeployModel.S> & Model.S = {},
    C extends Partial<DeployModel.C> & Model.C = {},
    R extends Partial<DeployModel.R> & Model.R = {},
> extends Model<
    E & DeployModel.E,
    S & DeployModel.S,
    C & DeployModel.C,
    R & DeployModel.R
> {
    public get route() {
        const result = super.route;
        const player: PlayerModel | undefined = result.list.find(item => item instanceof PlayerModel);
        return {
            ...result,
            player,
        }
    }
    
    constructor(props: DeployModel['props'] & {
        state: S,
        child: C,
        refer: R,
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        })
    }

    public abstract run(board?: BoardModel): void
}