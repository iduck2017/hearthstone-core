import { Model } from "set-piece";

export namespace WeakMapModel {
    export type E = {};
    export type S = {};
    export type C = {};
    export type R<
        K extends Model = Model, 
        V extends Model = Model,
    > = { key?: K; } & Record<number, V | undefined>
}

export class WeakMapModel<
    K extends Model = Model,
    V extends Model = Model,
> extends Model<
    WeakMapModel.E, 
    WeakMapModel.S, 
    WeakMapModel.C, 
    WeakMapModel.R<K, V>
> {
    public static generate<
        K extends Model = Model,
        V extends Model = Model,
    >(values: Array<V | undefined>, key: K): WeakMapModel<K, V> {
        const refer: Record<number, V | undefined> = {};
        values.forEach((item, index) => {
            refer[index] = item;
        })
        return new WeakMapModel<K, V>({
            refer: { key, ...refer }
        })
    }

    constructor(props?: WeakMapModel<K, V>['props']) {
        props = props ?? {}
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public get values(): Array<V | undefined> {
        const refer = this.refer;
        const keys = Object.keys(refer).map(Number).filter(Boolean);
        const result: Array<V | undefined> = [];
        const max = Math.max(...keys);
        for (let index = 0; index <= max; index++) {
            if (refer[index]) result.push(refer[index]);
            else result.push(undefined);
        }
        return result;
    }
}