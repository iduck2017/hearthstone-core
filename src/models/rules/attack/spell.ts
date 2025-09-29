import { Decor, Loader, Model, StateUtil, StoreUtil } from "set-piece";

export namespace SpellDamageProps {
    export type E = {};
    export type S = {
        current: number;
    };
    export type C = {};
    export type R = {};
    export type P = {};
}

export class SpellDamageDecor extends Decor<SpellDamageProps.S> {
    public add(value: number) { this.detail.current += value }
}

@StateUtil.use(SpellDamageDecor)
@StoreUtil.is('spell-damage')
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