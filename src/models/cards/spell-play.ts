import { Model, TranxUtil } from "set-piece";
import { SpellEffectModel } from "../features/hooks/spell-effect";
import { WeakMapModel } from "../rules/weak-map";
import { SpellHooksOptions } from "../features/group/spell";
import { SpellCardModel } from "./spell";
import { PlayerModel } from "../player";
import { CallerModel } from "../rules/caller";

export namespace SpellPlayModel {
    export type E = {}
    export type S = {
        from: number;
        isPending: boolean;
    }
    export type C = {}
    export type R = {
        params: WeakMapModel<SpellEffectModel, Model[]>[]
    }
}

export class SpellPlayModel extends Model<
    SpellPlayModel.E,
    SpellPlayModel.S,
    SpellPlayModel.C,
    SpellPlayModel.R
> implements CallerModel<[SpellEffectModel]> {
    public get route() {
        const result = super.route;
        const spell: SpellCardModel | undefined = result.items.find(item => item instanceof SpellCardModel)
        return {
            ...result,
            player: result.items.find(item => item instanceof PlayerModel),
            spell,
        }
    }

    constructor(props?: SpellPlayModel['props']) {
        props = props ?? {}
        super({
            uuid: props.uuid,
            state: { 
                from: 0,
                isPending: false,
                ...props.state 
            },
            child: { ...props.child },
            refer: { 
                params: [],
                ...props.refer 
            },
        });
    }

    public get config(): SpellHooksOptions {
        const result = new Map<SpellEffectModel, Model[]>();
        this.origin.refer.params?.forEach(item => {
            if (!item.refer.key) return;
            if (!item.refer.value) return;
            result.set(item.refer.key, item.refer.value);
        })
        return {
            effects: result,
        };
    }

    public del(hook: SpellEffectModel) {
        const params = this.origin.refer.params;
        if (!params) return;
        const index = params.findIndex(item => item.refer.key === hook);
        if (index === -1) return;
        params.splice(index, 1);
    }

    public run(from: number, config: SpellHooksOptions) {
        const player = this.route.player;
        const spell = this.route.spell;
        if (!player) return;
        if (!spell) return;
        // effect
        this.toRun(from, config);
    }

    @TranxUtil.span()
    protected toRun(from: number, config: SpellHooksOptions) {
        this.origin.state.isPending = true;
        this.origin.state.from = from;
        config.effects.forEach((params, item) => {
            this.origin.refer.params?.push(
                new WeakMapModel({
                    refer: {
                        key: item,
                        value: params,
                    }
                })
            )
        })
        this.next()
    }

    next(hook?: SpellEffectModel) {
        const from = this.origin.state.from;
        const pair = this.origin.refer.params?.shift();
        if (!pair) {
            console.log('🔍 finish spell effect')
            const spell = this.route.spell;
            if (!spell) return;
            this.reset();
            spell.onUse(from, this.config)
        } else {
            const key = pair.refer.key;
            const value = pair.refer.value;
            if (!key) return;
            if (!value) return;
            console.log('🔍 run spell effect', key.name, value.map(item => item.name))
            key.promise(this);
            key.run(...value);
        }
    }

    @TranxUtil.span()
    protected reset() {
        this.origin.state.isPending = false;
        this.origin.state.from = 0;
        this.origin.refer.params = [];
    }
}

