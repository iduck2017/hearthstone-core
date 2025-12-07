import { Model, TranxUtil } from "set-piece";
import { DamageEvent } from "../../types/events/damage";
import { DisposeModel } from "./dispose";
import { SpellEffectModel } from "../features/hooks/spell-effect";
import { DivineShieldModel } from "../features/entries/divine-shield";
import { AbortEvent } from "../../types/events/abort";

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
        // spell damage
        tasks.forEach(item => {
            const method = item.detail.method;
            if (method instanceof SpellEffectModel) {
                const effect: SpellEffectModel = method;
                const offset = effect.state.offset;
                item.update(item.detail.result + offset);
            }
        })
        tasks.forEach(item => {
            const source = item.detail.source;
            const damage = source.child.damage;
            const isValid = damage.toDeal(item);
            return isValid
        });
        tasks = tasks.filter(item => {
            const target = item.detail.target;
            const health = target.child.health
            const isValid = health.toConsume(item)
            return isValid;
        })
        // divine sheild
        tasks = tasks.filter(item => item.detail.isValid);
        DivineShieldModel.block(tasks);
        tasks = tasks.filter(item => item.detail.isValid);
        DamageModel.doDeal(tasks);
        tasks = tasks.filter(item => item.detail.result > 0 && item.detail.isValid);
        tasks.forEach(item => item.detail.target.child.health.onConsume(item));
        tasks.forEach(item => item.detail.source.child.damage.event.onDeal(item));
    }

    @TranxUtil.span()
    private static doDeal(tasks: DamageEvent[]) {
        tasks.forEach(item => item.detail.target.child.health.doComsume(item));
    }

    constructor(props?: DamageModel['props']) {
        super({
            uuid: props?.uuid,
            state: { ...props?.state },
            child: { ...props?.child },
            refer: { ...props?.refer },
        })
    }

    protected toDeal(event: DamageEvent): boolean {
        this.event.toDeal(event)
        const isValid = event.detail.isValid;
        if (!isValid) return false;
        return true
    }
}
