import { FeatureModel } from "../feature";

export namespace TauntModel {
    export type Event = {
        onActive: {};
    };
    export type State = {};
    export type Child = {};
    export type Refer = {};
}

export class TauntModel extends FeatureModel<
    TauntModel.Event, 
    TauntModel.State, 
    TauntModel.Child, 
    TauntModel.Refer
> {
    constructor(props: TauntModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Taunt',
                desc: 'Taunt',
                status: 1,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        })
    }

    public get(): boolean {
        if (this.state.status) return false;
        this.draft.state.status = 1;
        this.event.onActive({});
        return true;
    }
}