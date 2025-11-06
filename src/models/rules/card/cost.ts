import { Decor, Method, Model, StateUtil, TemplUtil } from "set-piece";
import { PlayerModel } from "../../player";
import { GameModel } from "../../game";
import { CardModel } from "../../cards";
import { Operator, OperatorType } from "../../../types/operator";

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
}


export class CostDecor extends Decor<CostModel.S> {

    private operations: Operator[] = [];
    public get result() {
        const result = { ...this._origin };
        const items = this.operations; // .filter(item => !(item.reason instanceof IRoleBuffModel));
        // plus first
        items.sort((a, b) => {
            if (a.offset > 0 && b.offset < 0) return -1;
            if (a.offset < 0 && b.offset > 0) return 1;
            return 0;
        })
        items.sort((a, b) => {
            if (a.offset < 0 || b.offset < 0) return 0;
            if (a.maximum === undefined) return 1;
            if (b.maximum === undefined) return -1;
            if (a.maximum < b.maximum) return -1;
            return 0;
        })
        items.sort((a, b) => {
            if (a.offset > 0 || b.offset > 0) return 0;
            if (a.minumum === undefined) return -1;
            if (b.minumum === undefined) return 1;
            if (a.minumum > b.minumum) return -1;
            return 0;
        })
        items.sort((a, b) => {
            if (a.type === OperatorType.SET) return -1;
            if (b.type === OperatorType.SET) return 1;
            return 0;
        })
        items.forEach(item => {
            if (item.type === OperatorType.ADD) {
                if (item.maximum !== undefined) {
                    if (result.current + item.offset > item.maximum) result.current = item.maximum;
                    else result.current += item.offset;
                } else if (item.minumum !== undefined) {
                    if (result.current + item.offset < item.minumum) result.current = item.minumum;
                    else result.current += item.offset;
                } else {
                    result.current += item.offset;
                }
            }
            if (item.type === OperatorType.SET) result.current = item.offset;
        })
        if (result.current <= 0) result.current = 0;
        return result;
    }
    
    public add(operation: Operator) { 
        this.operations.push(operation);
    }
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
            player: result.items.find(item => item instanceof PlayerModel),
            card: result.items.find(item => item instanceof CardModel),
        }
    }

    public get chunk() {
        return {
            current: this.state.current,
            origin: this.state.origin,
            type: this.state.type !== CostType.MANA ? this.state.type : undefined,  
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