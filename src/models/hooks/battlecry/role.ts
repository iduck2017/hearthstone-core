import { Event, Method, Model, Props } from "set-piece";
import { SelectEvent, SelectUtil } from "../../../utils/select";
import { FeatureModel, FeatureProps } from "../../features";
import { CardFeatureModel } from "../../features/card";

export namespace RoleBattlecryProps {
    export type E = {
        toRun: Event;
        onRun: Event;
    };
    export type S = {};
    export type C = {};
    export type R = {};
}

export abstract class RoleBattlecryModel<
    T extends Model[] = Model[],
    E extends Partial<RoleBattlecryProps.E> & Props.E = {},
    S extends Partial<RoleBattlecryProps.S> & Props.S = {},
    C extends Partial<RoleBattlecryProps.C> & Props.C = {},
    R extends Partial<RoleBattlecryProps.R> & Props.R = {}
> extends CardFeatureModel<
    E & RoleBattlecryProps.E, 
    S & RoleBattlecryProps.S, 
    C & RoleBattlecryProps.C, 
    R & RoleBattlecryProps.R
> {
    public static async toRun(
        items: Readonly<RoleBattlecryModel[]>
    ): Promise<Map<RoleBattlecryModel, Model[]> | undefined> {
        const result = new Map<RoleBattlecryModel, Model[]>();
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

    constructor(loader: Method<RoleBattlecryModel['props'] & {
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

    public async run(from: number, to: number, ...params: T) {
        if (!this.state.isActive) return;
      
        const event = new Event({})
        this.event.toRun(event);
        if (event.isAbort) return;
        
        await this.doRun(from, to, ...params);
        this.event.onRun(new Event({}));
    }   

    protected abstract doRun(from: number, to: number, ...params: T): Promise<void>;

    public abstract toRun(): { [K in keyof T]: SelectEvent<T[K]> } | undefined;
}