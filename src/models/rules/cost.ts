import { Model } from "set-piece";

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

    public get state() {
        const state = super.state;
        return {
            ...state,
            current: state.origin + state.offset,
        }
    }

    constructor(props: CostModel['props'] & {
        state: Pick<CostProps.S, 'origin'>;
    }) {
        super({
            uuid: props.uuid,
            state: { 
                offset: 0,
                type: CostType.MANA,
                ...props.state 
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
    
}