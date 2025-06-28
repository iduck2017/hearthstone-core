import { Model, TranxService } from "set-piece";
import { MinionCardModel } from "../card/minion";
import { RoleModel } from ".";
import { RootModel } from "../root";
import { GameModel } from "../game";
import { PlayerModel } from "../player";
import { HandModel } from "../container/hand";
import { BoardModel } from "../container/board";
import { MinionRaceType } from "@/types/card";
import { Optional } from "@/types";

export namespace MinionRoleModel {
    export type State = Partial<RoleModel.State> & {
        races: MinionRaceType[];
    };
    export type Event = Partial<RoleModel.Event> & {
        onSummon: {};
    };
    export type Child = Partial<RoleModel.Child> & {};
    export type Refer = Partial<RoleModel.Refer> & {};
}

export class MinionRoleModel<
    P extends MinionCardModel = MinionCardModel,
    E extends Partial<MinionRoleModel.Event> = {},
    S extends Partial<MinionRoleModel.State> = {},
    C extends Partial<MinionRoleModel.Child> & Model.Child = {},
    R extends Partial<MinionRoleModel.Refer> & Model.Refer = {}
> extends RoleModel<
    P,
    E & MinionRoleModel.Event,
    S & MinionRoleModel.State,
    C & MinionRoleModel.Child,
    R & MinionRoleModel.Refer
> {
    constructor(props: MinionRoleModel['props'] & {
        uuid: string | undefined;
        state: S 
            & Pick<RoleModel.State, 'attack' | 'health'> 
            & Pick<MinionRoleModel.State, 'races'>, 
        child: C, 
        refer: R
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        })
    }
    
    public get route(): Readonly<Optional<{
        parent: P;
        card: MinionCardModel;
        root: RootModel;
        game: GameModel;
        owner: PlayerModel;
        hand: HandModel;
        board: BoardModel;
        opponent: PlayerModel;
    }>> {
        const route = super.route;
        const card = route?.parent;
        return {
            parent: route.parent,
            owner: route.owner,
            opponent: route.opponent,
            root: route.root,
            game: route.game,
            card,
            hand: card?.route.hand,
            board: card?.route.board,
        }
    }

    @TranxService.use()
    public summon() {
        const owner = this.route.owner;
        const board = owner?.child.board;
        const hand = this.route.hand;
        const card = this.route.card;
        if (!board || !hand || !card) return;
        hand.del(card);
        board.add(card);
        this.event.onSummon({});
    }
}