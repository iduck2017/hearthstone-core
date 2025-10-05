import { Decor, Method, Model, StateUtil } from "set-piece";
import { PlayerModel } from "../player";
import { GameModel } from "../game";
import { CardModel } from "../cards";

export enum CostType {
    MANA = 1,
    HEALTH,
}

export namespace CostProps {
    export type S = {
        type: CostType;
        origin: number;
        current: number;
    }
    export type E = {}
    export type C = {}
    export type R = {}
    export type P = {
        game: GameModel;
        card: CardModel;
        player: PlayerModel;
    }
}

export class CostDecor extends Decor<CostProps.S> {
    
    private isFree = false;
    private laneAuraGt0: number[] = [];
    private laneAuraGt1: number[] = [];

    public get result() {
        const result = { ...this.detail }
        this.laneAuraGt0.forEach(item => {
            if (result.current + item < 0) result.current = 0;
            else result.current += item;
        });
        this.laneAuraGt1.forEach(item => {
            if (result.current + item < 1) return;
            else result.current += item;
        });
        if (this.isFree) result.current = 0;
        return result;
    }

    public add(value: number, isLimit?: boolean) {
        if (isLimit) this.laneAuraGt1.push(value);
        else this.laneAuraGt0.push(value);
    }

    public free() { this.isFree = true; }
}

@StateUtil.use(CostDecor)
export class CostModel extends Model<
    CostProps.E, 
    CostProps.S, 
    CostProps.C, 
    CostProps.R,
    CostProps.P
> {
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
            const current = props.state.current ?? props.state.origin;
            return {
                uuid: props.uuid,
                state: { 
                    type: CostType.MANA,
                    current,
                    ...props.state 
                },
                child: { ...props.child },
                refer: { ...props.refer },
                route: {
                    game: GameModel.prototype,
                    player: PlayerModel.prototype,
                    card: CardModel.prototype,
                },
            }
        });
    }

}