import { Model, TranxUtil } from "set-piece";
import { RestoreEvent } from "../../types/restore";
import { CardModel, MinionCardModel, PlayerModel } from "../..";

export namespace RestoreModel {
    export type E = {
        onRun: RestoreEvent,
        toRun: RestoreEvent
    };
    export type S = {};
    export type C = {};
    export type R = {};
}

export class RestoreModel extends Model<
    RestoreModel.E,
    RestoreModel.S,
    RestoreModel.C,
    RestoreModel.R
> {
    public static run(tasks: RestoreEvent[]) {
        tasks.forEach(item => item.detail.source.child.restore.event.toRun(item));
        tasks.forEach(item => item.detail.target.child.health.toHeal(item));
        
        tasks = tasks.filter(item => !item.detail.isAbort);
        tasks = RestoreModel.doRun(tasks);

        tasks = tasks.filter(item => !item.detail.isAbort);
        tasks.forEach(item => item.detail.target.child.health.onHeal(item));
        tasks.forEach(item => item.detail.source.child.restore.onRun(item));
    }

    @TranxUtil.span()
    private static doRun(tasks: RestoreEvent[]) {
        return tasks.map(item => item.detail.target.child.health.doHeal(item));
    }

    constructor(props?: RestoreModel['props']) {
        super({
            uuid: props?.uuid,
            state: { ...props?.state },
            child: { ...props?.child },
            refer: { ...props?.refer },
        })
    }

    protected onRun(event: RestoreEvent) {
        return this.event.onRun(event);
    }
    
}