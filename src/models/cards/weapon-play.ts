import { Model, TranxUtil } from "set-piece";
import { WeaponBattlecryModel } from "../features/hooks/weapon-battlecry";
import { WeakMapModel } from "../rules/weak-map";
import { WeaponHooksOptions } from "../features/group/weapon";
import { WeaponCardModel } from "./weapon";
import { PlayerModel } from "../player";
import { CallerModel } from "../rules/caller";

export namespace WeaponPlayModel {
    export type E = {}
    export type S = {
        from: number;
        index: number;
        isPending: boolean;
    }
    export type C = {
        params: WeakMapModel<WeaponBattlecryModel, Model[]>[]
    }
    export type R = {
    }
}

export class WeaponPlayModel extends Model<
    WeaponPlayModel.E,
    WeaponPlayModel.S,
    WeaponPlayModel.C,
    WeaponPlayModel.R
> implements CallerModel<[WeaponBattlecryModel]> {
    public get route() {
        const result = super.route;
        const weapon: WeaponCardModel | undefined = result.items.find(item => item instanceof WeaponCardModel)
        return {
            ...result,
            player: result.items.find(item => item instanceof PlayerModel),
            weapon,
        }
    }

    constructor(props?: WeaponPlayModel['props']) {
        props = props ?? {}
        super({
            uuid: props.uuid,
            state: { 
                from: 0,
                index: 0,
                isPending: false,
                ...props.state 
            },
            child: { 
                params: [],
                ...props.child 
            },
            refer: { 
                ...props.refer 
            },
        });
    }

    public get config(): WeaponHooksOptions {
        const result = new Map<WeaponBattlecryModel, Model[]>();
        this.origin.child.params?.forEach(item => {
            if (!item.refer.key) return;
            if (!item.refer.value) return;
            result.set(item.refer.key, item.refer.value);
        })
        return {
            battlecry: result,
        };
    }

    public del(hook: WeaponBattlecryModel) {
        const params = this.origin.child.params;
        if (!params) return;
        const index = params.findIndex(item => item.refer.key === hook);
        if (index === -1) return;
        params.splice(index, 1);
    }

    public run(from: number, config: WeaponHooksOptions) {
        const player = this.route.player;
        const weapon = this.route.weapon;
        if (!player) return;
        if (!weapon) return;
        // battlecry
        this.toRun(from, config);
        this.next()
    }

    @TranxUtil.span()
    protected toRun(from: number, config: WeaponHooksOptions) {
        this.origin.state.isPending = true;
        this.origin.state.from = from;
        this.origin.state.index = 0;
        config.battlecry.forEach((params, item) => {
            this.origin.child.params?.push(
                new WeakMapModel({
                    refer: {
                        key: item,
                        value: params,
                    }
                })
            )
        })
    }

    next(hook?: WeaponBattlecryModel) {
        const from = this.origin.state.from;
        const index = this.origin.state.index;
        this.origin.state.index += 1;
        const pair = this.origin.child.params?.[index];
        if (!pair) {
            console.log('🔍 finish weapon battlecry')
            const weapon = this.route.weapon;
            if (!weapon) return;
            this.reset();
            weapon.onUse(from, this.config)
        } else {
            const key = pair.refer.key;
            const value = pair.refer.value;
            console.log('🔍 run weapon battlecry', key?.name, value?.map(item => item.name))
            if (!key) return;
            if (!value) return;
            key.promise(this);
            key.run(from, ...value);
        }
    }

    @TranxUtil.span()
    protected reset() {
        this.origin.state.isPending = false;
        this.origin.state.from = 0;
        this.origin.state.index = 0;
        this.origin.child.params = [];
    }
}

