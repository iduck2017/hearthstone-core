import { FeatureModel } from ".";

export namespace TauntModel {
    export type Event = {
        onActive: {};
    };
    export type State = {
        isActive: boolean;
    };
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
                isActive: false,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        })
    }

    protected disable(): boolean {
        if (!this.state.isActive) return false;
        this.draft.state.isActive = false;
        return true;
    }

    public get(): boolean {
        if (this.state.isActive) return false;
        this.draft.state.isActive = true;
        this.event.onActive({});
        return true;
    }
}