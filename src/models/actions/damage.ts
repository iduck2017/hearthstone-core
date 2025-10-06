import { Event, Loader, Model, TranxUtil } from "set-piece";
import { DamageEvent, DamageType } from "../../types/damage";
import { DisposeModel } from "../rules/dispose";
import { CardModel, HeroModel, MinionCardModel, PlayerModel, SpellCardModel } from "../..";

export namespace DamageProps {
    export type E = {
        onRun: DamageEvent,
        toRun: DamageEvent
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
    DamageProps.E,
    DamageProps.S,
    DamageProps.C,
    DamageProps.R,
    DamageProps.P
> {
    @DisposeModel.span()
    public static run(tasks: DamageEvent[]) {
        tasks.forEach(item => item.detail.source.child.damage.event.toRun(item));
        tasks.forEach(item => item.detail.target.child.health.toHurt(item));
        
        tasks = tasks.filter(item => !item.isAbort);
        DamageModel.doRun(tasks);

        tasks = tasks.filter(item => item.detail.result > 0 && !item.isAbort);
        tasks.forEach(item => item.detail.target.child.health.onHurt(item));
        tasks.forEach(item => item.detail.source.child.damage.onRun(item));
    }

    @TranxUtil.span()
    private static doRun(tasks: DamageEvent[]) {
        tasks.forEach(item => item.detail.target.child.health.doHurt(item));
    }

    constructor(loader?: Loader<DamageModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: { ...props.child },
                refer: { ...props.refer },
                route: {
                    card: CardModel.prototype,
                    minion: MinionCardModel.prototype,
                    player: PlayerModel.prototype
                }
            }
        })
    }


    private onRun(event: DamageEvent) {
        this.event.onRun(event);
    }
}
