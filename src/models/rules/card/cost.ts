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
    export type P = {
        game: GameModel;
        card: CardModel;
        player: PlayerModel;
    }
}


export class CostDecor extends Decor<CostModel.S> {
    private operations: Operator[] = [];
    public get result() {
        const result = { ...this._origin };
        // buff
        // const buffs = this.operations
        //     .filter(item => item.reason instanceof ICostBuffModel)
        //     .sort((a, b) => a.reason.uuid.localeCompare(b.reason.uuid));
        // buffs.forEach(item => {
        //     if (item.type === OperationType.ADD) result.current += item.value;
        //     if (item.type === OperationType.SET) result.current = item.value;
        // })
        const items = this.operations; // .filter(item => !(item.reason instanceof IRoleBuffModel));
        // plus first
        items.sort((a, b) => {
            if (a.offset > 0 && b.offset < 0) return -1;
            if (a.offset < 0 && b.offset > 0) return 1;
            return 0;
        })
        // plus: 最大值小的优先执行，没有最大值则最后执行
        items.sort((a, b) => {
            if (a.offset < 0 || b.offset < 0) return 0;
            if (a.maximum === undefined) return 1;
            if (b.maximum === undefined) return -1;
            if (a.maximum < b.maximum) return -1;
            return 0;
        })
        // minus: 最小值大的优先执行，没有最小值则最后执行
        items.sort((a, b) => {
            if (a.offset > 0 || b.offset > 0) return 0;
            if (a.minumum === undefined) return -1;
            if (b.minumum === undefined) return 1;
            if (a.minumum > b.minumum) return -1;
            return 0;
        })
        // set: 最后执行
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

// export class CostDecor extends Decor<CostModel.S> {
    
//     private isFree = false;
//     private laneAuraGt0: number[] = [];
//     private laneAuraGt1: number[] = [];

//     public get result() {
//         const result = { ...this._origin }
//         this.laneAuraGt0.forEach(item => {
//             if (result.current + item < 0) result.current = 0;
//             else result.current += item;
//         });
//         this.laneAuraGt1.forEach(item => {
//             if (result.current + item < 1) return;
//             else result.current += item;
//         });
//         if (this.isFree) result.current = 0;
//         return result;
//     }

//     public add(value: number, isLimit?: boolean) {
//         if (isLimit) this.laneAuraGt1.push(value);
//         else this.laneAuraGt0.push(value);
//     }

//     public free() { this.isFree = true; }
// }

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