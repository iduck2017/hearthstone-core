import { Decor, Method, Model, Props, StateUtil } from "set-piece";
import { SpellCardModel } from "../../cards/spell";
import { EffectModel, EffectProps } from ".";
import { FeatureProps } from "..";
import { RoleModel, SelectUtil, SPELL_ROUTE, SpellRoute } from "../../..";

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
> extends EffectModel<T,
    E & SpellEffectProps.E,
    S & SpellEffectProps.S,
    C & SpellEffectProps.C,
    R & SpellEffectProps.R,
    SpellEffectProps.P
> {
    public static async toRun(items: Readonly<SpellEffectModel[]>): Promise<Map<SpellEffectModel, Model[]> | undefined> {
        const result = new Map<SpellEffectModel, Model[]>();
        for (const item of items) {
            const selectors = item.toRun();
            if (!selectors) continue;
            for (const selector of selectors) {
                selector.filter(item => {
                    if (!(item instanceof RoleModel)) return true;
                    const elusive = item.child.feats.child.elusive;
                    // exclude elusive
                    if (elusive.state.isActive) console.log('elusive', item.route.card?.name);
                    if (elusive.state.isActive) return false;
                    return true;
                })
                if (!selector.options.length) return;
            }
            const params: Model[] = [];
            for (const item of selectors) {
                const result = await SelectUtil.get(item);
                if (result === undefined) return;
                params.push(result);
            }
            result.set(item, params);
        }
        return result;
    }

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