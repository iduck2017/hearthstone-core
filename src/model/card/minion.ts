import { DebugUtil, Model, TranxUtil } from "set-piece";
import { CardModel } from ".";
import { RoleModel } from "../role";
import { SelectEvent, SelectUtil } from "../../utils/select";

export enum MinionRaceType {
    UNDEAD = 1,
    BEAST,
    ELEMENTAL,
    MURLOC,
    DRAENEI,
}

export namespace MinionCardModel {
    export type Event = Partial<CardModel.Event> & {
        onSummon: {};
    }
    export type State = Partial<CardModel.State> & {
        readonly races: MinionRaceType[];
    };
    export type Child = Partial<CardModel.Child> & {
        readonly role: RoleModel;
    };
    export type Refer = Partial<CardModel.Refer>;
}

export abstract class MinionCardModel<
    E extends Partial<MinionCardModel.Event> & Model.Event = {},
    S extends Partial<MinionCardModel.State> & Model.State = {},
    C extends Partial<MinionCardModel.Child> & Model.Child = {},
    R extends Partial<MinionCardModel.Refer> & Model.Refer = {}
> extends CardModel<
    E & MinionCardModel.Event, 
    S & MinionCardModel.State,  
    C & MinionCardModel.Child,
    R & MinionCardModel.Refer
> {
    constructor(props: MinionCardModel['props'] & {
        uuid: string | undefined;
        state: S & Pick<MinionCardModel.State, 'races'> & Pick<CardModel.State, 'name' | 'desc' | 'mana'>,
        child: C & Pick<MinionCardModel.Child, 'role'>,
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
        this.doSummon(position);
        await this.onPlay(event);
    }

    public summon(pos?: number) {
        const player = this.route.player;
        if (!player) return;
        const board = player.child.board;
        const size = board.child.cards.length;
        if (pos === undefined) pos = size;
        this.doSummon(pos);
        this.event.onSummon({});
    }

    @TranxUtil.span()
    private doSummon(pos: number) {
        const player = this.route.player;
        if (!player) return;
        const card = player.child.hand.del(this);
        if (!card) return;
        player.child.board.add(card, pos); 
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