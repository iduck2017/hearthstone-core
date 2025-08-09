import { DebugUtil, Model, Route, TranxUtil } from "set-piece";
import { PlayerModel } from "../player";
import { GameModel } from ".";

export namespace TurnModel {
    export type State = {
        count: number;
    };
    export type Event = {
        onEnd: {};
        onStart: {};
    };
    export type Child = {};
    export type Refer = {
        current?: PlayerModel;
    };
}

export class TurnModel extends Model<
    TurnModel.Event, 
    TurnModel.State, 
    TurnModel.Child,
    TurnModel.Refer
> {
    public get route() {
        const path = super.route.path;
        return { 
            ...super.route,
            game: path.find(item => item instanceof GameModel),
        } 
    }

    constructor(props: TurnModel['props']) {
        super({
            uuid: props.uuid,
            state: { 
                count: 0,
                ...props.state 
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
    
    @DebugUtil.log()
    public next() {
        let player = this.refer.current;
        let board = player?.child.board;
        let roles = board?.child.cards.map(item => item.child.role);
        this.event.onEnd({});
        this.doNext();
        player = this.refer.current;
        board = player?.child.board;
        roles = board?.child.cards.map(item => item.child.role);
        roles?.forEach(role => role.child.action.reset());
        this.event.onStart({});
    }

    @TranxUtil.span()
    private doNext() {
        const game = this.route.game;
        this.draft.state.count ++;
        this.draft.refer.current = this.refer.current?.refer.opponent ?? game?.child.playerA;
    }

}