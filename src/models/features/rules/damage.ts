import { Model, TranxUtil } from "set-piece";
import { DamageEvent, DamageType } from "../../../types/events/damage";
import { DisposeModel } from "../dispose";

export namespace DamageModel {
    export type E = {
        onDeal: DamageEvent,
        toDeal: DamageEvent,
    };
    export type S = {};
    export type C = {};
    export type R = {};
}

export class DamageModel extends Model<
    DamageModel.E,
    DamageModel.S,
    DamageModel.C,
    DamageModel.R
> {
    @DisposeModel.span()
    public static deal(tasks: DamageEvent[]) {
        tasks.forEach(item => item.detail.source.child.damage.event.toDeal(item));
        tasks.forEach(item => item.detail.target.child.health.startConsume(item));
        
        tasks = tasks.filter(item => !item.detail.aborted);
        DamageModel._deal(tasks);
        tasks = tasks.filter(item => item.detail.result > 0 && !item.detail.aborted);
        tasks.forEach(item => item.detail.target.child.health.endConsume(item));
        tasks.forEach(item => item.detail.source.child.damage.event.onDeal(item));
    }
    @TranxUtil.span()
    private static _deal(tasks: DamageEvent[]) {
        tasks.forEach(item => item.detail.target.child.health.consume(item));
    }

    constructor(props?: DamageModel['props']) {
        super({
            uuid: props?.uuid,
            state: { ...props?.state },
            child: { ...props?.child },
            refer: { ...props?.refer },
        })
    }

}
