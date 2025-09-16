import { Event, Loader, Method, Model, Props } from "set-piece"
import { BoardModel } from "../../containers/board"
import { MinionCardModel, PlayerModel, SecretCardModel, WeaponCardModel } from "../../.."

export namespace DeployProps {
    export type E = {
        toRun: void;
        onRun: void;
    }
    export type S = {}
    export type C = {}
    export type R = {}
    export type P = {
        player: PlayerModel;
        minion: MinionCardModel;
        weapon: WeaponCardModel;
        secret: SecretCardModel;
    }
}

export abstract class DeployModel extends Model<
    DeployProps.E,
    DeployProps.S,
    DeployProps.C,
    DeployProps.R,
    DeployProps.P
> {
    constructor(loader: Loader<DeployModel>) {
        super(() => {
            const props = loader() ?? {}
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: { ...props.child },
                refer: { ...props.refer },
                route: {
                    player: PlayerModel.prototype,
                    minion: MinionCardModel.prototype,
                    weapon: WeaponCardModel.prototype,
                    secret: SecretCardModel.prototype,
                },
            }
        })
    }

    public abstract run(board?: BoardModel): void
}