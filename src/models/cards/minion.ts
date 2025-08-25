import { TranxUtil } from "set-piece";
import { SelectEvent, SelectUtil } from "../../utils/select";
import { BoardModel } from "../containers/board";
import { RoleModel } from "../role";
import { AbortEvent } from "../../utils/abort";

export enum RaceType {
    UNDEAD = 1,
    BEAST,
    ELEMENTAL,
    MURLOC,
    DRAENEI,
    PIRATE,
    DRAGON,
    MECH
}

export namespace MinionModel {
    export type Event = {
        toRemove: AbortEvent;
        onSummon: {};
        onRemove: {};
    }
    export type State = {
        readonly races: RaceType[];
    };
    export type Child = {};
    export type Refer = {};
}

export class MinionModel extends RoleModel<
    MinionModel.Event,
    MinionModel.State,
    MinionModel.Child,
    MinionModel.Refer
> {
    constructor(props: MinionModel['props'] & {
        state: MinionModel.State;
        child: Pick<RoleModel.Child, 'health' | 'attack'>;
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }


    public summon(board: BoardModel, position?: number) {
        this.doSummon(board, position);
        this.onSummon();
    }

    public async toSummon(): Promise<number | undefined> {
        const player = this.route.player;
        if (!player) return;
        const board = player.child.board;
        const size = board.child.cards.length;
        const options = new Array(size + 1).fill(0).map((item, index) => index);
        const position = await SelectUtil.get(new SelectEvent(options));
        return position;
    }

    @TranxUtil.span()
    public doSummon(board: BoardModel, position?: number) {
        const card = this.route.card;
        if (!card) return;
        const right = board.child.cards.length;
        if (position === undefined) position = right;
        if (position === -1) position = right;
        const player = this.route.player;
        const hand = player?.child.hand;
        if (hand) hand.del(card);
        board.add(card, position); 
    }

    public onSummon() {
        this.event.onSummon({});
    }
    
    @TranxUtil.span()
    public clear() {
        const player = this.route.player;
        const card = this.route.card;
        if (!card) return;
        if (!player) return;
        player.child.board.del(card);
        player.child.graveyard.add(card);
    }

    public remove() {
        this.event.toRemove(new AbortEvent());
        this.clear();
        this.event.onRemove({});
    }
}