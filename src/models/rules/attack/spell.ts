import { Loader, Model } from "set-piece";

export namespace SpellAttackProps {
    export type E = {};
    export type S = {
        current: number;
    };
    export type C = {};
    export type R = {};
    export type P = {};
}

export class SpellAttackModel extends Model<
    SpellAttackProps.E,
    SpellAttackProps.S,
    SpellAttackProps.C,
    SpellAttackProps.R,
    SpellAttackProps.P
> {
    constructor(loader?: Loader<SpellAttackModel>) {
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