import { Model } from "set-piece";

export namespace DependencyModel {
    export type E = {};
    export type S = {};
    export type C = {};
    export type R<K extends Model = Model> = Partial<Record<number, Model>> & { key?: K; }
}

export class DependencyModel<
    K extends Model = Model,
> extends Model<
    DependencyModel.E, 
    DependencyModel.S, 
    DependencyModel.C, 
    DependencyModel.R<K>
> {
    public static new<K extends Model = Model>(
        values: Array<Model | undefined>, 
        key: K
    ): DependencyModel<K> {
        const refer: Record<number, Model | undefined> = {};
        values.forEach((item, index) => refer[index] = item)
        return new DependencyModel<K>({
            refer: { key, ...refer }
        })
    }

    constructor(props?: DependencyModel<K>['props']) {
        props = props ?? {}
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public get values(): Array<Model | undefined> {
        const refer = this.refer;
        const keys = Object.keys(refer)
            .map(Number)
            .filter(item => !isNaN(item));
        const max = Math.max(...keys);

        const result: Array<Model | undefined> = [];
        for (let index = 0; index <= max; index++) {
            if (refer[index]) result.push(refer[index]);
            else result.push(undefined);
        }
        return result;
    }
}