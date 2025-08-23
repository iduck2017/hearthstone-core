import { Model, Route, TranxUtil } from "set-piece";
import { GameModel } from "../game";
import { HandModel } from "./hand";
import { BoardModel } from "./board";
import { DeckModel } from "./deck";
import { HeroModel } from "../heroes";
import { GraveyardModel } from "./graveyard";

export namespace PlayerModel {
    export type State = {};
    export type Event = {
    };
    export type Child = {
        readonly hero: HeroModel;
        readonly hand: HandModel;
        readonly deck: DeckModel;
        readonly board: BoardModel;
        readonly graveyard: GraveyardModel;
    };
    export type Refer = {}
}

export class PlayerModel extends Model<
    PlayerModel.Event, 
    PlayerModel.State, 
    PlayerModel.Child,
    PlayerModel.Refer
> {
    public get route() {
        const route = super.route;
        return { 
            ...route,
            game: route.path.find(item => item instanceof GameModel),
        }
    }

    public get refer() {
        const game = this.route.game;
        const board = this.child.board;
        let opponent: PlayerModel | undefined;
        if (game?.child.playerA === this) opponent = game.child.playerB;
        if (game?.child.playerB === this) opponent = game.child.playerA;
        const minions = board.child.cards.map(item => item.child.role);
        return { 
            ...super.refer, 
            opponent, 
            minions, 
            roles: [ ...minions, this.child.hero.child.role ],
        }
    }

    constructor(props: PlayerModel['props'] & {
        child: Pick<PlayerModel.Child, 'hero'>;
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: {
                hand: new HandModel({}),
                deck: new DeckModel({}),
                board: new BoardModel({}),
                graveyard: new GraveyardModel({}),
                ...props.child
            },
            refer: { ...props.refer },
        });
    }
}



