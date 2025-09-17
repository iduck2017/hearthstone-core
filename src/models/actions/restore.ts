import { Loader, Model, TranxUtil } from "set-piece";
import { RestoreEvent } from "../../types/restore";
import { CardModel, MinionCardModel, PlayerModel } from "../..";

export namespace RestoreProps {
    export type E = {
        onRun: RestoreEvent,
        toRun: RestoreEvent
    };
    export type S = {};
    export type C = {};
    export type R = {};
    export type P = {
        player: PlayerModel;
        card: CardModel;
        minion: MinionCardModel;
    };
}

export class RestoreModel extends Model<
    RestoreProps.E,
    RestoreProps.S,
    RestoreProps.C,
    RestoreProps.R,
    RestoreProps.P
> {
    public static run(tasks: RestoreEvent[]) {
        tasks.forEach(item => item.source.child.restore.event.toRun(item));
        tasks.forEach(item => item.target.child.health.toHeal(item));
        
        tasks = tasks.filter(item => !item.isCancel);
        tasks = RestoreModel.doRun(tasks);

        tasks = tasks.filter(item => item.result > 0 && !item.isCancel);
        tasks.forEach(item => item.target.child.health.onHeal(item));
        tasks.forEach(item => item.source.child.restore.onRun(item));
    }

    @TranxUtil.span()
    private static doRun(tasks: RestoreEvent[]) {
        return tasks.map(item => item.target.child.health.doHeal(item));
    }

    constructor(loader?: Loader<RestoreModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: { ...props.child },
                refer: { ...props.refer },
                route: {
                    player: PlayerModel.prototype,
                    card: CardModel.prototype,
                    minion: MinionCardModel.prototype,
                },
            }
        })
    }

    protected onRun(event: RestoreEvent) {
        return this.event.onRun(event);
    }
    
}