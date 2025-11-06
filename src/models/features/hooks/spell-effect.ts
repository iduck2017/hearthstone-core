import { Decor, Model } from "set-piece";
import { CardModel, EffectModel, FeatureModel, PlayerModel, RoleModel, SelectEvent, SpellCardModel } from "../../..";

export namespace SpellEffectModel {
    export type E = {};
    export type S = { damage: number[] };
    export type C = {};
    export type R = {};
}

export class SpellEffectDecor<S extends Model.S = {}> extends Decor<
    SpellEffectModel['origin']['state'] & S
> {
    public add(value: number) {
        this._origin.damage = this._origin.damage.map(item => item + value);
    }
}

export abstract class SpellEffectModel<
    T extends any[] = any[],
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

    public get state() {
        const result = super.state;
        const damage = result.damage;
        let desc = result.desc;
        damage.forEach((item, index) => {
            const regexp = new RegExp(`{{spellDamage\\[${index}\\]}}`, 'g');
            desc = desc.replace(regexp, item.toString());
        })
        return { ...result, desc }
    }

    public get route() {
        const result = super.route;
        const card: CardModel | undefined = result.items.find(item => item instanceof CardModel);
        const spell: SpellCardModel | undefined = result.items.find(item => item instanceof SpellCardModel);
        return {
            ...result,
            card,
            spell,
        }
    }

    public static check(
        hooks: Readonly<SpellEffectModel[]>
    ): Map<SpellEffectModel, SelectEvent[]> | undefined {
        const result = new Map<SpellEffectModel, SelectEvent[]>();
        for (const hook of hooks) {
            const selectors = hook.toRun();
            if (!selectors) return;
            for (const item of selectors) {
                item.desc = hook.state.desc;
                item.filter(item => {
                    if (!(item instanceof RoleModel)) return true;
                    const elusive = item.child.feats.child.elusive;
                    // exclude elusive
                    if (elusive.state.isActive) return false;
                    return true;
                })
                if (!item.options.length) return;
            }
            result.set(hook, selectors);
        }
        return result;
    }

    public static async select(
        player: PlayerModel,
        hooks: Readonly<SpellEffectModel[]>
    ): Promise<Map<SpellEffectModel, Model[]> | undefined> {
        const result = new Map<SpellEffectModel, Model[]>();
        const selectors = SpellEffectModel.check(hooks);
        if (!selectors) return;
        for (const item of selectors) {
            const [key, value] = item;
            const params: any[] = [];
            for (const selector of value) {
                const result = await player.child.controller.get(selector);
                if (result === undefined) return;
                params.push(result);
            }
            result.set(key, params);
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