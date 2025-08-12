import { DebugUtil, Model, TranxUtil } from "set-piece";
import { CardModel, PlayForm } from ".";
import { RaceType } from "../../types";
import { RoleModel } from "../role";
import { SelectUtil } from "../../utils/select";

export namespace MinionCardModel {
    export type Event = Partial<CardModel.Event> & {
        onSummon: {};
        onRemove: {};
    }
    export type State = Partial<CardModel.State> & {
        readonly races: RaceType[];
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

    /** play */
    @DebugUtil.log()
    public async play() {
        const player = this.route.player;
        if (!player) return;
        const board = player.child.board;
        const size = board.child.cards.length;
        const list = new Array(size + 1).fill(0).map((item, index) => index);
        const position = await SelectUtil.get({ targets: list });
        if (position === undefined) return;
        const form = await this.toPlay();
        if (!form) return;
        this.doPlay(position);
        await this.onPlay(form);
        this.event.onSummon({})
    }

    @TranxUtil.span()
    private doPlay(pos: number) {
        const player = this.route.player;
        if (!player) return;
        const card = player.child.hand.del(this);
        if (!card) return;
        player.child.board.add(card, pos); 
    }

    /** dispose */
    @TranxUtil.span()
    public doDispose() {
        const player = this.route.player;
        if (!player) return;
        const card = player.child.board.del(this);
        if (!card) return;
        player.child.graveyard.add(card);
    }
}