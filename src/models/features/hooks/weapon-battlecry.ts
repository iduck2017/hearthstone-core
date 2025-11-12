import { DebugUtil, Event, Method, Model } from "set-piece";
import { Selector } from "../../rules/selector";
import { FeatureModel, PlayerModel } from "../../..";
import { AbortEvent } from "../../../types/abort-event";
import { CardFeatureModel } from "../card";
import { CallerModel } from "../../rules/caller";
import { CalleeModel } from "../../rules/callee";

export namespace WeaponBattlecryModel {
    export type E = {
        toRun: AbortEvent;
        onRun: {};
    };
    export type S = {
        isAsync: boolean;
    };
    export type C = {};
    export type R = {
        callers: CallerModel<[WeaponBattlecryModel]>[]
    };
}

export abstract class WeaponBattlecryModel<
    T extends any[] = any[],
    E extends Partial<WeaponBattlecryModel.E> & Partial<FeatureModel.E> & Model.E = {},
    S extends Partial<WeaponBattlecryModel.S> & Partial<FeatureModel.S> & Model.S = {},
    C extends Partial<WeaponBattlecryModel.C> & Partial<FeatureModel.C> & Model.C = {},
    R extends Partial<WeaponBattlecryModel.R> & Partial<FeatureModel.R> & Model.R = {},
> extends CardFeatureModel<
    E & WeaponBattlecryModel.E, 
    S & WeaponBattlecryModel.S, 
    C & WeaponBattlecryModel.C, 
    R & WeaponBattlecryModel.R
> implements CalleeModel<[WeaponBattlecryModel]> {
    
    public readonly promise = CalleeModel.prototype.promise.bind(this);
    public readonly resolve = CalleeModel.prototype.resolve.bind(this);
    public static async select(
        player: PlayerModel,
        hooks: Readonly<WeaponBattlecryModel[]>
    ): Promise<Map<WeaponBattlecryModel, Model[]> | undefined> {
        const result = new Map<WeaponBattlecryModel, Model[]>();
        for (const hook of hooks) {
            const selectors = hook.toRun();
            // condition not match
            if (!selectors) continue;
            for (const item of selectors) {
                item.desc = hook.state.desc;
                // invalid selector
                if (!item.options.length) return;
            }
            const params: Model[] = [];
            for (const item of selectors) {
                const result = await player.child.controller.get(item);
                // canceled by user
                if (result === undefined) return;
                params.push(result);
            }
            result.set(hook, params);
        }
        return result;
    }

    constructor(props: WeaponBattlecryModel['props'] & {
        uuid: string | undefined;
        state: S & Pick<FeatureModel.S, 'desc' | 'name'>;
        child: C;
        refer: R;
    }) {
        super({
            uuid: props.uuid,
            state: { 
                isActive: true,
                isAsync: false,
                ...props.state,
            },
            child: { ...props.child },
            refer: { 
                callers: [],
                ...props.refer 
            },
        });
    }

    public run(from: number, ...params: T) {
        if (!this.state.isActive) return;
        
        const event = new AbortEvent({});
        this.event.toRun(event);
        if (event.detail.isAbort) return;

        DebugUtil.log(`${this.state.name} run (${this.state.desc})`);
        this.doRun(from, ...params);
        if (!this.state.isAsync) this.onRun();
    }

    protected onRun() {
        this.event.onRun(new Event({}));
        this.resolve(this);
    }

    protected abstract doRun(from: number, ...params: T): void;

    public abstract toRun(): { [K in keyof T]: Selector<T[K]> } | undefined;
}