import { Model, TranxUtil } from "set-piece";
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

    constructor(props: BoardModel['props']) {
        super({
            uuid: props.uuid,
            state: {},
            child: { 
                minions: props.child?.minions ?? [],
                ...props.child,
            },
            refer: { 
                order: props.child?.minions ?? [],
                ...props.refer
            }
        })
    }

    @TranxUtil.span()
    public add(card: MinionModel, pos: number) {
        this.draft.child.minions.push(card);
        this.draft.refer.order?.splice(pos, 0, card);
    }

    public del(card: MinionModel) {
        let index = this.draft.child.minions.indexOf(card);
        if (index !== -1) this.draft.child.minions.splice(index, 1);
        index = this.draft.refer.order?.indexOf(card) ?? -1;
        if (index !== -1) this.draft.refer.order?.splice(index, 1);
        return card;
    }
}