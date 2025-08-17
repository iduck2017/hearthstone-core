import { Model } from "set-piece";
import { FeatureModel } from ".";

export namespace WindfuryModel {
    export type Event = {
        onGet: {};
    };
    export type State = {
        isEnable: boolean;
        level: number;
    };
    export type Child = {};
    export type Refer = {};
}

export class WindfuryModel extends FeatureModel<
    WindfuryModel.Event,
    WindfuryModel.State,
    WindfuryModel.Child,
    WindfuryModel.Refer
> {
    constructor(props: WindfuryModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Windfury',
                desc: 'Can attack twice each turn.',
                isEnable: false,
                level: 0,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public get(): boolean {
        if (this.state.isEnable) return false;
        this.draft.state.isEnable = true;
        this.event.onGet({});
        return true;
    }
    
    protected disable(): void {
        this.draft.state.isEnable = false;
        this.draft.state.level = 0;
    }
}
