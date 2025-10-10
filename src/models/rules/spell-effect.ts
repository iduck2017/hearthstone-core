import { Decor, Model } from "set-piece";
import { EffectModel, FeatureModel, RoleModel, SelectUtil } from "../..";

export namespace SpellEffectModel {
    export type E = {};
    export type S = { damage: number[] };
    export type C = {};
    export type R = {};
}

export class SpellEffectDecor<S extends Model.S = {}> extends Decor<
    S & SpellEffectModel.S & EffectModel.S & FeatureModel.S
> {
    public add(value: number) {
        this._detail.damage = this._detail.damage.map(item => item + value);
    }
}

export abstract class SpellEffectModel<
    T extends Model[] = Model[],
    E extends Partial<SpellEffectModel.E> & Model.E = {},
    S extends Partial<SpellEffectModel.S> & Model.S = {},
    C extends Partial<SpellEffectModel.C> & Model.C = {},
    R extends Partial<SpellEffectModel.R> & Model.R = {},
> extends EffectModel<T,
    E & SpellEffectModel.E,
    S & SpellEffectModel.S,
    C & SpellEffectModel.C,
    R & SpellEffectModel.R
> {
    public get decor(): SpellEffectDecor<S> { return new SpellEffectDecor(this); }

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

    constructor(props: SpellEffectModel['props'] & {
        child: C;
        state: S & SpellEffectModel.S & Pick<FeatureModel.S, 'desc' | 'name'>;
        refer: R;
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        })
    }
}