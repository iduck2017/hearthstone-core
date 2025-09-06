import { Loader, Model, TranxUtil } from "set-piece";
import { GameModel } from "../game";
import { PlayerModel } from "../player";
import { MinionModel } from "../cards/minion";
import { CardModel } from "../cards";

export namespace BoardProps {
    export type E = {};
    export type S = {};
    export type C = {
        readonly minions: MinionModel[]
    };
    export type R = {
        readonly order: CardModel[];
    };
}

export class BoardModel extends Model<
    BoardProps.E,
    BoardProps.S,
    BoardProps.C,
    BoardProps.R
> {
    public get route() {
        const route = super.route;
        return { 
            ...route,
            game: route.order.find(item => item instanceof GameModel),
            player: route.order.find(item => item instanceof PlayerModel),
        }
    }

    constructor(loader?: Loader<BoardModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {},
                child: { 
                    minions: [],
                    ...props.child,
                },
                refer: { 
                    order: props.child?.minions ?? [],
                    ...props.refer
                }
            }
        })
    }

    @TranxUtil.span()
    public add(card: MinionModel, position?: number) {
        const order = this.draft.refer.order;
        if (position === -1) position = order.length;
        if (position === undefined) position = order.length;
        const cards = this.draft.child.minions;
        cards.push(card);
        order.splice(position, 0, card);
        return card;
    }

    public del(card: MinionModel) {
        const cards = this.draft.child.minions;
        const order = this.draft.refer.order;
        let index = cards.indexOf(card);
        if (index !== -1) cards.splice(index, 1);
        index = order.indexOf(card);
        if (index !== -1) order.splice(index, 1);
        return card;
    }
}