import { Model } from "set-piece";

export namespace WeakMapModel {
    export type E = {};
    export type S = {};
    export type C = {};
    export type R<
        K extends Model = Model, 
        V extends Model | Model[] = Model | Model[],
    > = {
        key?: K;
        value?: V;
    };
}

export class WeakMapModel<
    K extends Model = Model,
    V extends Model | Model[] = Model | Model[],
> extends Model<
    WeakMapModel.E, 
    WeakMapModel.S, 
    WeakMapModel.C, 
    WeakMapModel.R<K, V>
> {
    constructor(props?: WeakMapModel<K, V>['props']) {
        props = props ?? {}
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}