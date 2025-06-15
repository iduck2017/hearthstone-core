import { Model, Props } from "set-piece";
import { BoardModel } from "./board";  
import { HeroModel } from "./hero";
import { HandModel } from "./hand";
import { GameModel } from "./game";
import { RootModel } from "./root";
import { CardModel } from "./card";

export namespace PlayerModel {
    export type State = {};
    export type Event = {};
    export type Child = {
        readonly board: BoardModel;
        readonly hero: HeroModel;
        readonly hand: HandModel;
    };
    export type Refer = {};
}

export class PlayerModel extends Model<
    GameModel,
    PlayerModel.Event, 
    PlayerModel.State, 
    PlayerModel.Child,
    PlayerModel.Refer
> {
    constructor(props: Props<
        PlayerModel.State,
        PlayerModel.Child,
        PlayerModel.Refer
    > & {
        child: {
            readonly hero: HeroModel;
        };
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: {
                board: new BoardModel({}),
                hand: new HandModel({}),
                ...props.child
            },
            refer: { ...props.refer },
        });
    }


    public get route(): Readonly<{
        root?: RootModel;
        parent?: GameModel;
        opponent?: PlayerModel;
    }> {
        const route = super.route;
        const root = route.root instanceof RootModel ? route.root : undefined;
        const { player1, player2 } = route.parent?.child ?? {};
        const opponent = player1 === this ? player2 : player1;
        return {
            ...super.route,
            root,
            opponent,
        }
    }
}
