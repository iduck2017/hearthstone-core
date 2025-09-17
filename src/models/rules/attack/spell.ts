import { Loader, Model } from "set-piece";

export namespace SpellDamageProps {
    export type E = {};
    export type S = {
        current: number;
    };
    export type C = {};
    export type R = {};
    export type P = {};
}

export class SpellDamageModel extends Model<
    SpellDamageProps.E,
    SpellDamageProps.S,
    SpellDamageProps.C,
    SpellDamageProps.R,
    SpellDamageProps.P
> {
    constructor(loader?: Loader<SpellDamageModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                child: { ...props.child },
                state: { 
                    current: 0,
                    ...props.state 
                },
                refer: { ...props.refer },
                route: {}
            }
        });
    }
}