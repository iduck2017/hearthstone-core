import { Model } from "set-piece";

export enum CostType {
    MANA = 1,
    HEALTH,
}

export namespace CostModel {
    export type State = {
        origin: number;
        offset: number;
        type: CostType;
    }
    export type Event = {}
    export type Child = {}
    export type Refer = {}
}


export class CostModel extends Model<
    CostModel.Event, 
    CostModel.State, 
    CostModel.Child, 
    CostModel.Refer
> {

    public get state() {
        const state = super.state;
        return {
            ...state,
            current: state.origin + state.offset,
        }
    }

    constructor(props: CostModel['props'] & {
        state: Pick<CostModel.State, 'origin'>;
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