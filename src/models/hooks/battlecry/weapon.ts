import { Event, Method, Model, Props } from "set-piece";
import { SelectEvent, SelectUtil } from "../../../utils/select";
import { FeatureModel, FeatureProps } from "../../features";
import { CardFeatureModel } from "../../features/card";

export namespace WeaponBattlecryProps {
    export type E = {
        toRun: Event;
        onRun: Event;
    };
    export type S = {};
    export type C = {};
    export type R = {};
}

export abstract class WeaponBattlecryModel<
    T extends Model[] = Model[],
    E extends Partial<WeaponBattlecryProps.E> & Props.E = {},
    S extends Partial<WeaponBattlecryProps.S> & Props.S = {},
    C extends Partial<WeaponBattlecryProps.C> & Props.C = {},
    R extends Partial<WeaponBattlecryProps.R> & Props.R = {}
> extends CardFeatureModel<
    E & WeaponBattlecryProps.E, 
    S & WeaponBattlecryProps.S, 
    C & WeaponBattlecryProps.C, 
    R & WeaponBattlecryProps.R
> {
    public static async toRun(
        items: Readonly<WeaponBattlecryModel[]>
    ): Promise<Map<WeaponBattlecryModel, Model[]> | undefined> {
        const result = new Map<WeaponBattlecryModel, Model[]>();
        for (const item of items) {
            const selectors = item.toRun();
            // condition not match
            if (!selectors) continue;
            for (const item of selectors) {
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
            result.set(item, params);
        }
        return result;
    }

    constructor(loader: Method<WeaponBattlecryModel['props'] & {
        uuid: string | undefined;
        state: S & Pick<FeatureProps.S, 'desc' | 'name'>;
        child: C;
        refer: R;
    }, []>) {
        super(() => {
            const props = loader?.();
            return {
                uuid: props.uuid,
                state: { 
                    isActive: true,
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
                route: {},
            }
        });
    }

    public async run(from: number, ...params: T) {
        if (!this.state.isActive) return;
        
        const signal = new Event()
        this.event.toRun(signal);
        if (signal.isAbort) return;

        await this.doRun(from, ...params);
        this.event.onRun(new Event());
    }   

    protected abstract doRun(from: number, ...params: T): Promise<void>;

    public abstract toRun(): { [K in keyof T]: SelectEvent<T[K]> } | undefined;
}