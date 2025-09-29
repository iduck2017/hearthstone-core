import { Method, Model } from "set-piece";
import { PlayerModel } from "../player";
import { GameModel } from "../game";

export enum CostType {
    MANA = 1,
    HEALTH,
}

export namespace CostProps {
    export type S = {
        type: CostType;
        origin: number;
        offset: number;
    }
    export type E = {}
    export type C = {}
    export type R = {}
    export type P = {
        game: GameModel;
        player: PlayerModel;
    }
}


export class CostModel extends Model<
    CostProps.E, 
    CostProps.S, 
    CostProps.C, 
    CostProps.R,
    CostProps.P
> {
    public get state() {
        const state = super.state;
        const current = state.origin + state.offset;
        return {
            ...state,
            current,
        }
    }

    public get status() {
        const player = this.route.player;
        if (!player) return false;
        if (super.state.type === CostType.MANA) {
            const mana = player.child.mana;
            if (mana.state.current < this.state.current) return false;
            return true;
        }
        return false;
    }

    constructor(loader: Method<CostModel['props'] & {
        state: Pick<CostProps.S, 'origin'>;
    }, []>) {
        super(() => {
            const props = loader?.();
            return {
                uuid: props.uuid,
                state: { 
                    offset: 0,
                    type: CostType.MANA,
                    ...props.state 
                },
                child: { ...props.child },
                refer: { ...props.refer },
                route: {
                    game: GameModel.prototype,
                    player: PlayerModel.prototype,
                },
            }
        });
    }

}