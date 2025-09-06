import { Loader, Model } from "set-piece";

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
    constructor(loader?: Loader<RestoreModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: { ...props.child },
                refer: { ...props.refer }
            }
        })
    }
}