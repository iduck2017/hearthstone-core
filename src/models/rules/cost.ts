import { Model, TemplUtil } from "set-piece";
import { PlayerModel } from "../entities/player";
import { CardModel } from "../entities/cards";
import { CostDecor } from "../../types/decors/cost";

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