import { Event, Loader, Model, TranxUtil } from "set-piece";
import { PlayerModel } from "../player";
import { CardModel } from "../cards";
import { MinionCardModel } from "../cards/minion";
import { DamageEvent } from "../../types/damage";
import { DisposeModel } from "../rules/dispose";

export namespace DamageProps {
    export type E = {
        onRun: DamageEvent,
        toRun: DamageEvent
    };
    export type S = {};
    export type C = {};
    export type R = {};
}

export class DamageModel extends Model<
    DamageProps.E,
    DamageProps.S,
    DamageProps.C,
    DamageProps.R
> {
    @DisposeModel.span()
    public static run(tasks: DamageEvent[]) {
        tasks.forEach(item => item.detail.source.event.toRun(item));
        tasks.forEach(item => item.detail.target.child.health.toHurt(item));
        
        tasks = tasks.filter(item => !item.isCancel);
        DamageModel.doRun(tasks);

        tasks = tasks.filter(item => item.detail.result > 0 && !item.isCancel);
        tasks.forEach(item => item.detail.target.child.health.onHurt(item));
        tasks.forEach(item => item.detail.source.onRun(item));
    }

    @TranxUtil.span()
    private static doRun(tasks: DamageEvent[]) {
        return tasks.forEach(item => item.detail.target.child.health.doHurt(item));
    }

    public get route() {
        const route = super.route;
        const card: CardModel | undefined = route.order.find(item => item instanceof CardModel);
        const minion: MinionCardModel | undefined = route.order.find(item => item instanceof MinionCardModel);
        return {
            ...route,
            card,
            minion,
            player: route.order.find(item => item instanceof PlayerModel)
        }
    } 

    constructor(loader?: Loader<DamageModel>) {
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

    private onRun(event: DamageEvent) {
        this.event.onRun(event);
    }
}
