import { Model } from "set-piece";

export namespace RestoreProps {
    export type E = {
        onRun: Event,
        toRun: Event
    };
    export type S = {};
    export type C = {};
    export type R = {};
}

export class RestoreModel extends Model {
    constructor(props: RestoreModel['props']) {
        super({
            uuid: props.uuid,
            state: {},
            child: {},
            refer: {}
        })
    }
}