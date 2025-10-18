import { DebugUtil, Event, Method, Model } from "set-piece";
import { SelectEvent, SelectUtil } from "../../../utils/select";
import { FeatureModel } from "../../..";
import { AbortEvent } from "../../../types/abort-event";
import { CardFeatureModel } from "../card";

export namespace WeaponBattlecryModel {
    export type E = {
        toRun: AbortEvent;
        onRun: {};
    };
    export type S = {};
    export type C = {};
    export type R = {};
}

export abstract class WeaponBattlecryModel<
    T extends any[] = any[],
    E extends Partial<WeaponBattlecryModel.E> & Model.E = {},
    S extends Partial<WeaponBattlecryModel.S> & Model.S = {},
    C extends Partial<WeaponBattlecryModel.C> & Model.C = {},
    R extends Partial<WeaponBattlecryModel.R> & Model.R = {},
> extends CardFeatureModel<
    E & WeaponBattlecryModel.E, 
    S & WeaponBattlecryModel.S, 
    C & WeaponBattlecryModel.C, 
    R & WeaponBattlecryModel.R
> {
    public static async select(
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
                const result = await SelectUtil.get(item);
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
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public async run(from: number, ...params: T) {
        if (!this.state.isActive) return;
        
        const event = new AbortEvent({});
        this.event.toRun(event);
        if (event.detail.isAbort) return;

        DebugUtil.log(`${this.state.name} run (${this.state.desc})`);
        await this.doRun(from, ...params);
        this.event.onRun(new Event({}));
    }   

    protected abstract doRun(from: number, ...params: T): Promise<void>;

    public abstract toRun(): { [K in keyof T]: SelectEvent<T[K]> } | undefined;
}