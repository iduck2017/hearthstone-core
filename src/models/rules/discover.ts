import { Model } from "set-piece";
import { CardModel } from "../cards";

export namespace DiscoverModel {
    export type E = {};
    export type S = {};
    export type C<T extends Model> = {
        options: T[];
    };
    export type R = {};
}

export class DiscoverModel<T extends Model> extends Model<
    DiscoverModel.E,
    DiscoverModel.S,
    DiscoverModel.C<T>,
    DiscoverModel.R
> {
    constructor(props?: DiscoverModel<T>['props']) {
        props = props ?? {}
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { options: [], ...props.child },
            refer: { ...props.refer },
        });
    }
}