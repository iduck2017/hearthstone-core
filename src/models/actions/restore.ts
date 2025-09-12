import { Loader, Model, TranxUtil } from "set-piece";
import { RestoreEvent } from "../../types/restore";

export namespace RestoreProps {
    export type E = {
        onRun: RestoreEvent,
        toRun: RestoreEvent
    };
    export type S = {};
    export type C = {};
    export type R = {};
}

export class RestoreModel extends Model<
    RestoreProps.E,
    RestoreProps.S,
    RestoreProps.C,
    RestoreProps.R
> {
    public static run(tasks: RestoreEvent[]) {
        tasks.forEach(item => item.detail.source.child.restore.event.toRun(item));
        tasks.forEach(item => item.detail.target.child.health.toHeal(item));
        
        tasks = tasks.filter(item => !item.isCancel);
        tasks = RestoreModel.doRun(tasks);

        tasks = tasks.filter(item => item.detail.result > 0 && !item.isCancel);
        tasks.forEach(item => item.detail.target.child.health.onHeal(item));
        tasks.forEach(item => item.detail.source.child.restore.onRun(item));
    }

    @TranxUtil.span()
    private static doRun(tasks: RestoreEvent[]) {
        return tasks.map(item => item.detail.target.child.health.doHeal(item));
    }

    constructor(loader?: Loader<RestoreModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: { ...props.child },
                refer: { ...props.refer }
            }
        })
    }

    protected onRun(event: RestoreEvent) {
        return this.event.onRun(event);
    }
    
}