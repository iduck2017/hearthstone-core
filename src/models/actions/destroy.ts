import { Event, Loader, Model } from "set-piece";
import { CardModel } from "../cards";
import { MinionCardModel } from "../cards/minion";
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
        const minion: MinionCardModel | undefined = route.order.find(item => item instanceof MinionCardModel);
        return {
            ...route,
            card,
            minion,
            player: route.order.find(item => item instanceof PlayerModel)
        }
    } 

    constructor(loader?: Loader<DestroyModel>) {
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
}