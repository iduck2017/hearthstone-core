import { Loader, Method, Model, Props } from "set-piece";
import { SelectEvent } from "../utils/select";

export namespace SpellProps {
    export type E = {};
    export type S = {};
    export type C = {};
    export type R = {};
}

export abstract class SpellModel<
    T extends Model[] = Model[],
    E extends Partial<SpellProps.E> & Props.E = {},
    S extends Partial<SpellProps.S> & Props.S = {},
    C extends Partial<SpellProps.S> & Props.C = {},
    R extends Partial<SpellProps.R> & Props.R = {}
> extends Model<
    E & SpellProps.E, 
    S & SpellProps.S,
    C & SpellProps.C, 
    R & SpellProps.R
> {
    constructor(loader: Method<SpellModel['props'] & {
        uuid: string | undefined,
        state: S,
        child: C,
        refer: R,
    }, []>) {
        super(() => {
            const props = loader();
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: { ...props.child },
                refer: { ...props.refer }
            }
        })
    }

    public async run(...params: T) {
        await this.doRun(...params);
    }

    protected abstract doRun(...params: T): Promise<void>;

    public abstract toRun(): { [K in keyof T]: SelectEvent<T[K]> } | undefined;
}