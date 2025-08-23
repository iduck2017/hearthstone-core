import { DebugUtil, Model, TranxUtil } from "set-piece";
import { CardModel } from ".";
import { RoleModel } from "../role";
import { SelectEvent, SelectUtil } from "../../utils/select";
import { BoardModel } from "../player/board";

export enum RaceType {
    UNDEAD = 1,
    BEAST,
    ELEMENTAL,
    MURLOC,
    DRAENEI,
    PIRATE,
}

export namespace MinionModel {
    export type Event = Partial<CardModel.Event> & {
        onSummon: {};
    }
    export type State = Partial<CardModel.State> & {
        readonly races: RaceType[];
    };
    export type Child = Partial<CardModel.Child> & {
        readonly role: RoleModel;
    };
    export type Refer = Partial<CardModel.Refer>;
}

export abstract class MinionModel<
    E extends Partial<MinionModel.Event> & Model.Event = {},
    S extends Partial<MinionModel.State> & Model.State = {},
    C extends Partial<MinionModel.Child> & Model.Child = {},
    R extends Partial<MinionModel.Refer> & Model.Refer = {}
> extends CardModel<
    E & MinionModel.Event, 
    S & MinionModel.State,  
    C & MinionModel.Child,
    R & MinionModel.Refer
> {
    constructor(props: MinionModel['props'] & {
        uuid: string | undefined;
        state: S & 
            Pick<MinionModel.State, 'races'> & 
            CardModel.State,
        child: C & 
            Pick<MinionModel.Child, 'role'> & 
            Pick<CardModel.Child, 'cost'>,
        refer: R
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @DebugUtil.log()
    public async play() {
        const player = this.route.player;
        if (!player) return;
        const board = player.child.board;
        const size = board.child.cards.length;
        const options = new Array(size + 1).fill(0).map((item, index) => index);
        const position = await SelectUtil.get(new SelectEvent(options));
        if (position === undefined) return;
        const event = await this.toPlay();
        if (!event) return;
        this.summon(board, position);
        await this.onPlay(event);
    }

    public summon(board: BoardModel, position?: number) {
        const size = board.child.cards.length;
        if (position === undefined) position = size;
        if (position < 0) position = size;
        this.doSummon(board, position);
        this.event.onSummon({});
    }

    @TranxUtil.span()
    private doSummon(board: BoardModel, position: number) {
        const player = this.route.player;
        const hand = player?.child.hand;
        if (hand) hand.del(this);
        board.add(this, position); 
    }
    
    @TranxUtil.span()
    public doClear() {
        const player = this.route.player;
        if (!player) return;
        const card = player.child.board.del(this);
        if (!card) return;
        player.child.graveyard.add(card);
    }
}