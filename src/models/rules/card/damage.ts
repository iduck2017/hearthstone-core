import { Model, TranxUtil } from "set-piece";
import { DamageEvent, DamageType } from "../../../types/damage-event";
import { DisposeModel } from "../../cards/dispose";
import { CardModel, HeroModel, MinionCardModel, PlayerModel, SpellCardModel } from "../../..";

export namespace DamageModel {
    export type E = {
        onDeal: DamageEvent,
        toDeal: DamageEvent,
    };
    export type S = {};
    export type C = {};
    export type R = {};
    export type P = {
        card: CardModel;
        minion: MinionCardModel;
        player: PlayerModel;
    };
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
        tasks.forEach(item => item.detail.target.child.health.toHurt(item));
        
        tasks = tasks.filter(item => !item.detail.isAbort);
        DamageModel.doDeal(tasks);

        tasks = tasks.filter(item => item.detail.result > 0 && !item.detail.isAbort);
        tasks.forEach(item => item.detail.target.child.health.onHurt(item));
        tasks.forEach(item => item.detail.source.child.damage.event.onDeal(item));
    }

    @TranxUtil.span()
    private static doDeal(tasks: DamageEvent[]) {
        tasks.forEach(item => item.detail.target.child.health.doHurt(item));
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
