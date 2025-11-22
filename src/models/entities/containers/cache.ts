import { Model } from "set-piece";

export namespace CacheModel {
    export type E = {};
    export type S = {};
    export type C = {
        readonly items: Model[]
    };
    export type R = {};
}

export class CacheModel extends Model<
    CacheModel.E,
    CacheModel.S,
    CacheModel.C,
    CacheModel.R
> {
    constructor(props: CacheModel['props']) {
        super({
            uuid: props.uuid,
            child: { 
                items: props.child?.items ?? [], 
                ...props.child 
            },
            state: { ...props.state },
            refer: { ...props.refer },
        });
    }

    public add(item: Model) {
        const child = this.origin.child;
        child.items.push()
    }

    public del(item: Model) {
        const child = this.origin.child;
        const index = child.items.indexOf(item);
        if (index === -1) return;
        child.items.splice(index, 1);
    }

    public has(item: Model): boolean {
        const child = this.origin.child;
        return child.items.includes(item);
    }
}