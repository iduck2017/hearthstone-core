import { Model, TranxUtil } from "set-piece";
import { RestoreEvent } from "../../types/restore-event";
import { CardModel, MinionCardModel, PlayerModel } from "../..";

export namespace RestoreModel {
    export type E = {
        onDeal: RestoreEvent,
        toDeal: RestoreEvent,
        onRecv: RestoreEvent,
        toRecv: RestoreEvent,
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
    public static deal(tasks: RestoreEvent[]) {
        tasks.forEach(item => item.detail.source.child.restore.event.toDeal(item));
        tasks.forEach(item => item.detail.target.child.health.toHeal(item));
        
        tasks = tasks.filter(item => !item.detail.isAbort);
        tasks = RestoreModel.doDeal(tasks);

        tasks = tasks.filter(item => !item.detail.isAbort);
        tasks.forEach(item => item.detail.target.child.health.onHeal(item));
        tasks.forEach(item => item.detail.source.child.restore.event.onDeal(item));
    }

    @TranxUtil.span()
    private static doDeal(tasks: RestoreEvent[]) {
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

    
}