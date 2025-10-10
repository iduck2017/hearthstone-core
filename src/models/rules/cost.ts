import { Decor, Method, Model, StateUtil, TemplUtil } from "set-piece";
import { PlayerModel } from "../player";
import { GameModel } from "../game";
import { CardModel } from "../cards";

export enum CostType {
    MANA = 1,
    HEALTH,
}

export namespace CostModel {
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

export class CostDecor extends Decor<CostModel.S> {
    
    private isFree = false;
    private laneAuraGt0: number[] = [];
    private laneAuraGt1: number[] = [];

    public get result() {
        const result = { ...this._detail }
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

@TemplUtil.is('cost')
export class CostModel extends Model<
    CostModel.E, 
    CostModel.S, 
    CostModel.C, 
    CostModel.R
> {
    public get decor(): CostDecor { return new CostDecor(this); }

    public get route() {
        const result = super.route;
        return {
            ...result,
            player: result.list.find(item => item instanceof PlayerModel),
            card: result.list.find(item => item instanceof CardModel),
        }
    }

    public get status() {
        const player = this.route.player;
        if (!player) return false;
        if (this.state.type === CostType.MANA) {
            const mana = player.child.mana;
            if (mana.state.current < this.state.current) return false;
            return true;
        }
        return false;
    }

    constructor(props?: CostModel['props']) {
        const state = props?.state ?? {};
        const current = state.current ?? state.origin ?? 0;
        super({ 
            uuid: props?.uuid,
            state: { 
                origin: 0,
                type: CostType.MANA,
                current,
                ...props?.state 
            },
            child: { ...props?.child },
            refer: { ...props?.refer },
        });
    }

}