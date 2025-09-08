import { DebugUtil, Model, TranxUtil, Props, Event, Format, Loader, Method } from "set-piece";
import { BoardModel } from "../containers/board";
import { SelectEvent, SelectUtil } from "../../utils/select";
import { HooksModel } from "../hooks/hooks";
import { CardModel, CardProps, PlayEvent } from ".";
import { RaceType } from "../../types/card";
import { FeaturesModel } from "../features/features";
import { RoleModel } from "../role";
import { BattlecryModel } from "../hooks/battlecry";
import { DisposeModel } from "../rules/dispose";
import { MinionDisposeModel } from "../rules/dispose/minion";

export type MinionPlayEvent = { position: number } & PlayEvent;

export namespace MinionProps {
    export type S = {
        readonly races: RaceType[];
    };
    export type E = {
        onPlay: Event;
        onSummon: Event;
    };
    export type C = {
        readonly role: RoleModel;
        readonly dispose: MinionDisposeModel
    };
    export type R = {};
}

export abstract class MinionModel<
    E extends Partial<MinionProps.E & CardProps.E> & Props.E = {},
    S extends Partial<MinionProps.S & CardProps.S> & Props.S = {},
    C extends Partial<MinionProps.C & CardProps.C> & Props.C = {},
    R extends Partial<MinionProps.R & CardProps.R> & Props.R = {}
> extends CardModel<
    E & MinionProps.E, 
    S & MinionProps.S, 
    C & MinionProps.C,
    R & MinionProps.R
> {
    constructor(loader: Method<MinionModel['props'] & {
        uuid: string | undefined;
        state: S & Format.State<Omit<CardProps.S, 'isActive'> & MinionProps.S>;
        child: C & Pick<MinionProps.C, 'role'> & Pick<CardProps.C, 'cost'>;
        refer: R;
    }, []>) {
        super(() => {
            const props = loader();
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: { 
                    dispose: props.child.dispose ?? new MinionDisposeModel(),
                    ...props.child 
                },
                refer: { ...props.refer },
            }
        });
    }


    public async play() {
        if (!this.state.isActive) return;
        const player = this.route.player;
        if (!player) return;
        const signal = this.event.toPlay(new Event({}));
        if (signal.isCancel) return;
        const event = await this.toPlay();
        if (!event) return;
        await this.doPlay(event);
        await this.event.onPlay(new Event({}));
    }

    protected async doPlay(event: MinionPlayEvent) {
        const player = this.route.player;
        if (!player) return;
        const board = player.child.board;
        this.doSummon(board, event.position);
        // battlecry
        await super.doPlay(event);
        this.event.onSummon(new Event({}));
    }
    
    protected async toPlay(): Promise<MinionPlayEvent | undefined> {
        // summon
        const position = await this.toSummon();
        if (position === undefined) return;

        const event = await super.toPlay();
        if (!event) return;
        return { ...event, position };
    }

    
    public summon(board: BoardModel, position?: number) {
        this.doSummon(board, position);
        this.event.onSummon(new Event({}));
    }

    private async toSummon(): Promise<number | undefined> {
        const player = this.route.player;
        if (!player) return;
        const board = player.child.board;
        const size = board.child.minions.length;
        const options = new Array(size + 1).fill(0).map((item, index) => index);
        const position = await SelectUtil.get(new SelectEvent(options));
        return position;
    }

    @TranxUtil.span()
    private doSummon(board: BoardModel, position?: number) {
        const player = this.route.player;
        const hand = player?.child.hand;
        if (hand) hand.del(this);
        board.add(this, position); 
    }


    @DebugUtil.log()
    public async dispose() {
        this.doRemove();
        super.dispose();
    }

    @TranxUtil.span()
    public doRemove() {
        const player = this.route.player;
        if (!player) return;
        player.child.board.del(this);
        player.child.graveyard.add(this);
    }

}