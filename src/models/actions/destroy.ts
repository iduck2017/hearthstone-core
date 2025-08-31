import { Event, Model } from "set-piece";
import { CardModel } from "../cards";
import { MinionModel } from "../cards/minion";
import { PlayerModel } from "../player";
import { RoleModel } from "../role";

export type DestroyEvent = Event<{
    target: RoleModel;
    source: DestroyModel;
}>;

export namespace DestroyProps {
    export type E = {
        onRun: Event,
        toRun: Event
    };
    export type S = {};
    export type C = {};
    export type R = {};
}

export class DestroyModel extends Model {
    public get route() {
        const route = super.route;
        const card: CardModel | undefined = route.order.find(item => item instanceof CardModel);
        const minion: MinionModel | undefined = route.order.find(item => item instanceof MinionModel);
        return {
            ...route,
            card,
            minion,
            player: route.order.find(item => item instanceof PlayerModel)
        }
    } 

    constructor(props: DestroyModel['props']) {
        super({
            uuid: props.uuid,
            state: {},
            child: {},
            refer: {}
        })
    }
}