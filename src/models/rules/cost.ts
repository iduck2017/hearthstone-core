import { Method, Model } from "set-piece";
import { PlayerModel } from "../player";
import { GameModel } from "../game";

export enum CostType {
    MANA = 1,
    HEALTH,
}

export namespace CostProps {
    export type S = {
        origin: number;
        offset: number;
        type: CostType;
    }
    export type E = {}
    export type C = {}
    export type R = {}
}


export class CostModel extends Model<
    CostProps.E, 
    CostProps.S, 
    CostProps.C, 
    CostProps.R
> {
    public get route() {
        const route = super.route;
        return {
            ...route,
            game: route.order.find(item => item instanceof GameModel),
            player: route.order.find(item => item instanceof PlayerModel)
        }
    }

    public get state() {
        const state = super.state;
        return {
            ...state,
            current: state.origin + state.offset,
        }
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
            }
        });
    }

    public check() {
        const player = this.route.player;
        if (!player) return false;
        if (this.state.type === CostType.MANA) {
            const mana = player.child.mana;
            if (mana.state.current < this.state.current) return false;
            return true;
        }
        return false;
    }
}