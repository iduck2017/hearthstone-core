import { Model, TranxUtil } from "set-piece";
import { CardModel } from "../card";
import { RoleModel } from ".";
import { GameModel } from "../game";
import { PlayerModel } from "../player";
import { BoardModel } from "../..";


export namespace ActionModel {
    export type State = {
        readonly origin: number;
        cost: number;
        isActive: boolean;
    };
    export type Event = {};
    export type Child = {};
    export type Refer = {};
}

export class ActionModel extends Model<
    ActionModel.Event,
    ActionModel.State,
    ActionModel.Child,
    ActionModel.Refer
> {
    public get route() {
        const route = super.route;
        const role: RoleModel | undefined = route.path.find(item => item instanceof RoleModel);
        const card: CardModel | undefined = route.path.find(item => item instanceof CardModel);
        return { 
            ...route, 
            role, 
            card,
            board: route.path.find(item => item instanceof BoardModel),
            game: route.path.find(item => item instanceof GameModel),
            player: route.path.find(item => item instanceof PlayerModel),
        }
    }

    public get state() {
        const state = super.state;
        return {
            ...state,
            current: state.origin - state.cost,
        }
    }

    constructor(props: ActionModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                origin: 1,
                cost: 0,
                isActive: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @TranxUtil.span()
    public reset() {
        this.draft.state.cost = 0;
    }

    public check(): boolean {
        const role = this.route.role;
        const game = this.route.game;
        const board = this.route.board;
        const player = this.route.player;
        if (!game) return false;
        if (!role) return false;
        if (!board) return false;
        if (!player) return false;
        const turn = game.child.turn;
        if (turn.refer.current !== player) return false;
        const sleep = role.child.sleep;
        const entries = role.child.entries;
        const frozen = entries.child.frozen;
        if (frozen.state.isActive) return false;
        if (sleep.state.isActive) return false;
        if (!this.state.isActive) return false;
        if (this.state.current <= 0) return false;
        return true;
    }

    public consume() {
        if (!this.check()) return false;
        this.draft.state.cost ++;
        return true;
    }
}