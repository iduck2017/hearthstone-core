import { DebugService, LogLevel, Model } from "set-piece";
import { BoardModel } from "./container/board";  
import { HeroModel } from "./hero";
import { HandModel } from "./container/hand";
import { GameModel } from "./game";
import { RootModel } from "./root";
import { Optional } from "@/types";

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
    constructor(props: PlayerModel['props'] & {
        child: Pick<PlayerModel.Child, 'hero'>;
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

    public get child() {
        const child = super.child;
        return {
            ...child,
            role: child.hero.child.role,
        }
    }

    public get route(): Readonly<Optional<{
        root: RootModel;
        parent: GameModel;
        opponent: PlayerModel;
    }>> {
        const route = super.route;
        const root = route.root instanceof RootModel ? route.root : undefined;
        const { playerA, playerB } = route.parent?.child ?? {};
        const opponent = playerA === this ? playerB : playerA;
        return {
            root,
            parent: route.parent,
            opponent,
        }
    }

    @DebugService.log()
    public endTurn() {
        const board = this.child.board;
        const roles = board.child.roles;
        roles.forEach(role => {
            role.endTurn();
        })
    }

    @DebugService.log()
    public startTurn() {
        const board = this.child.board;
        const roles = board.child.roles;
        roles.forEach(role => {
            role.startTurn();
        })
    }

}



