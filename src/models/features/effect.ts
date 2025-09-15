import { Loader, Method, Model, Props } from "set-piece";
import { SelectEvent, SelectUtil } from "../../utils/select";
import { FeatureModel, FeatureProps } from "../features";
import { CardFeatureModel } from "./card";

export namespace EffectProps {
    export type E = {};
    export type S = {};
    export type C = {};
    export type R = {};
}

export abstract class EffectModel<
    T extends Model[] = Model[],
    E extends Partial<FeatureProps.E> & Props.E = {},
    S extends Partial<FeatureProps.S> & Props.S = {},
    C extends Partial<FeatureProps.C> & Props.C = {},
    R extends Partial<FeatureProps.R> & Props.R = {},
> extends CardFeatureModel<
    E & EffectProps.E, 
    S & EffectProps.S,
    C & EffectProps.C, 
    R & EffectProps.R
> {
    public static async toRun(items: Readonly<EffectModel[]>): Promise<Map<EffectModel, Model[]> | undefined> {
        const result = new Map<EffectModel, Model[]>();
        for (const item of items) {
            const selectors = item.toRun();
            if (!selectors) continue;
            for (const item of selectors) {
                if (!item.options.length) return;
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

    constructor(loader: Method<EffectModel['props'] & {
        uuid: string | undefined,
        state: S & Pick<FeatureProps.S, 'desc' | 'name'>,
        child: C,
        refer: R,
    }, []>) {
        super(() => {
            const props = loader();
            return {
                uuid: props.uuid,
                state: {
                    isActive: true,
                    ...props.state 
                },
                child: { ...props.child },
                refer: { ...props.refer },
                route: {},
            }
        })
    }

    public async run(...params: T) {
        if (!this.state.isActive) return;
        await this.doRun(...params);
    }

    protected abstract doRun(...params: T): Promise<void>;

    public abstract toRun(): { [K in keyof T]: SelectEvent<T[K]> } | undefined;
}