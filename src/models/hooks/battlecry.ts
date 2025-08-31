import { Event, Model, Props } from "set-piece";
import { MinionModel } from "../cards/minion";
import { SelectEvent } from "../../utils/select";
import { FeatureModel, FeatureProps } from "../features";

export namespace BattlecryProps {
    export type E = {
        toRun: Event;
        onRun: Event;
    };
    export type S = {};
    export type C = {};
    export type R = {};
}

export abstract class BattlecryModel<
    T extends Model[] = Model[],
    E extends Partial<BattlecryProps.E> & Props.E = {},
    S extends Partial<BattlecryProps.S> & Props.S = {},
    C extends Partial<BattlecryProps.C> & Props.C = {},
    R extends Partial<BattlecryProps.R> & Props.R = {}
> extends FeatureModel<
    E & BattlecryProps.E, 
    S & BattlecryProps.S, 
    C & BattlecryProps.C, 
    R & BattlecryProps.R
> {
    constructor(props: BattlecryModel['props'] & {
        uuid: string | undefined;
        state: S & Pick<FeatureProps.S, 'desc' | 'name'>;
        child: C;
        refer: R;
    }) {
        super({
            uuid: props.uuid,
            state: { 
                status: 1,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public async run(...params: T) {
        if (!this.state.status) return;
        const signal = this.event.toRun(new Event({}));
        if (signal.isCancel) return;
        await this.doRun(...params);
        this.event.onRun(new Event({}));
    }   

    protected abstract doRun(...params: T): Promise<void>;

    public abstract toRun(): { [K in keyof T]: SelectEvent<T[K]> } | undefined;
}