import { Event, Model } from "set-piece";
import { PlayerModel } from "../player";
import { CardModel } from "../cards";
import { MinionModel } from "../cards/minion";
import { DamageEvent } from "../../types/damage";

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

    constructor(props: DamageModel['props']) {
        super({
            uuid: props.uuid,
            state: {},
            child: {},
            refer: {}
        })
    }
}
