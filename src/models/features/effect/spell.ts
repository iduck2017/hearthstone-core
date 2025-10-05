import { Decor, Method, Model, Props, StateUtil } from "set-piece";
import { SpellCardModel } from "../../cards/spell";
import { EffectModel, EffectProps } from ".";
import { FeatureProps } from "..";
import { SPELL_ROUTE, SpellRoute } from "../../..";

export namespace SpellEffectProps {
    export type E = {};
    export type S = { damage: number[] };
    export type C = {};
    export type R = {};
    export type P = SpellRoute;
}

export class SpellEffectDecor extends Decor<
    SpellEffectProps.S & 
    EffectProps.S & 
    FeatureProps.S
> {
    public add(value: number) {
        this.detail.damage = this.detail.damage.map(item => item + value);
    }
}

@StateUtil.use(SpellEffectDecor)
export abstract class SpellEffectModel<
    T extends Model[] = Model[],
    E extends Partial<SpellEffectProps.E> & Props.E = {},
    S extends Partial<SpellEffectProps.S> & Props.S = {},
    C extends Partial<SpellEffectProps.C> & Props.C = {},
    R extends Partial<SpellEffectProps.R> & Props.R = {},
> extends EffectModel<
    T,
    E & SpellEffectProps.E,
    S & SpellEffectProps.S,
    C & SpellEffectProps.C,
    R & SpellEffectProps.R,
    SpellEffectProps.P
> {
    constructor(loader: Method<SpellEffectModel['props'] & {
        child: C;
        state: S & SpellEffectProps.S & Pick<FeatureProps.S, 'desc' | 'name'>;
        refer: R;
    }, []>) {
        super(() => {
            const props = loader();
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: { ...props.child },
                refer: { ...props.refer },
                route: SPELL_ROUTE,
            }
        })
    }
}