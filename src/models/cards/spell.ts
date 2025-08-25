import { Model } from "set-piece";
import { AbortEvent } from "../../utils/abort";
import { SelectEvent } from "../../utils/select";

export namespace SpellModel {
    export type Event<T extends Model = Model> = {
        toRun: AbortEvent,
        onRun: { param: T }
    };
    export type State = {};
    export type Child = {};
    export type Refer = {}
}

export abstract class SpellModel<
   T extends Model = Model,
   E extends Partial<SpellModel.Event> & Model.Event = {},
   S extends Partial<SpellModel.State> & Model.State = {},
   C extends Partial<SpellModel.Child> & Model.Child = {},
   R extends Partial<SpellModel.Refer> & Model.Refer = {}
> extends Model<
    E & SpellModel.Event<T>,
    S & SpellModel.State,
    C & SpellModel.Child,
    R & SpellModel.Refer
> {
    constructor(props: SpellModel['props'] & {
        state: S,
        child: C,
        refer: R,
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer }
        })
    }
    
    public async run(param: T) {
        const event = this.event.toRun(new AbortEvent());
        if (event.isAbort) return;
        await this.doRun(param);
        this.event.onRun({ param });
    }

    protected abstract doRun(param: T): Promise<void>;

    public abstract toRun(): SelectEvent<T> | undefined;
}