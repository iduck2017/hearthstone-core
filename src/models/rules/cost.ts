import { Model } from "set-piece";

export namespace CostModel {
    export type State = {
        origin: number;
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
    constructor(props: CostModel['props'] & {
        state: Pick<CostModel.State, 'origin'>;
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}