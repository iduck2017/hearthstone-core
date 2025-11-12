import { Model, TranxUtil } from "set-piece";
import { MinionBattlecryModel } from "../features/hooks/minion-battlecry";
import { WeakMapModel } from "../rules/weak-map";
import { MinionHooksConfig } from "../features/group/minion";
import { MinionCardModel } from "./minion";
import { PlayerModel } from "../player";
import { CallerModel } from "../rules/caller";

export namespace MinionPlayModel {
    export type E = {}
    export type S = {
        from: number;
        to: number;
        isPending: boolean;
    }
    export type C = {}
    export type R = {
        params: WeakMapModel<MinionBattlecryModel, Model[]>[]
    }
}

export class MinionPlayModel extends Model<
    MinionPlayModel.E,
    MinionPlayModel.S,
    MinionPlayModel.C,
    MinionPlayModel.R
> implements CallerModel<[MinionBattlecryModel]> {
    public get route() {
        const result = super.route;
        const minion: MinionCardModel | undefined = result.items.find(item => item instanceof MinionCardModel)
        return {
            ...result,
            player: result.items.find(item => item instanceof PlayerModel),
            minion,
        }
    }

    constructor(props?: MinionPlayModel['props']) {
        props = props ?? {}
        super({
            uuid: props.uuid,
            state: { 
                from: 0,
                to: 0,
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

    public get config(): MinionHooksConfig {
        const result = new Map<MinionBattlecryModel, Model[]>();
        this.origin.refer.params?.forEach(item => {
            if (!item.refer.key) return;
            if (!item.refer.value) return;
            result.set(item.refer.key, item.refer.value);
        })
        return {
            battlecry: result,
        };
    }

    public del(hook: MinionBattlecryModel) {
        const params = this.origin.refer.params;
        if (!params) return;
        const index = params.findIndex(item => item.refer.key === hook);
        if (index === -1) return;
        params.splice(index, 1);
    }

    public run(from: number, to: number, config: MinionHooksConfig) {
        const player = this.route.player;
        const minion = this.route.minion;
        if (!player) return;
        if (!minion) return;
        // battlecry
        this.toRun(from, to, config);
    }

    @TranxUtil.span()
    protected toRun(from: number, to: number, config: MinionHooksConfig) {
        this.origin.state.isPending = true;
        this.origin.state.from = from;
        this.origin.state.to = to;
        config.battlecry.forEach((params, item) => {
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

    next() {
        const from = this.origin.state.from;
        const to = this.origin.state.to;
        const pair = this.origin.refer.params?.shift();
        if (!pair) {
            console.log('🔍 finish battlecry')
            const minion = this.route.minion;
            if (!minion) return;
            this.reset();
            minion.onUse(from, to, this.config)
        } else {
            const key = pair.refer.key;
            const value = pair.refer.value;
            if (!key) return;
            if (!value) return;
            console.log('🔍 run battlecry', key.name, value.map(item => item.name))
            key.promise(this);
            key.run(from, to, ...value);
        }
    }

    @TranxUtil.span()
    protected reset() {
        this.origin.state.isPending = false;
        this.origin.state.from = 0;
        this.origin.state.to = 0;
        this.origin.refer.params = [];
    }
}