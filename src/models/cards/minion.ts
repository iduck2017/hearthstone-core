import { Event, Method, State, TranxUtil, Model } from "set-piece";
import { MinionHooksOptions, MinionFeaturesModel } from "../features/group/minion";
import { RaceType } from "../../types/card-enums";
import { RoleModel } from "../role";
import { MinionDisposeModel } from "./dispose/minion";
import { CardModel } from ".";
import { AbortEvent } from "../../types/abort-event";
import { MinionBattlecryModel } from "../features/hooks/minion-battlecry";
import { SelectEvent, SelectUtil } from "../../utils/select";
import { BoardModel } from "./group/board";

export namespace MinionCardModel {
    export type S = {
        readonly races: RaceType[];
    };
    export type E = {
        readonly onTransform: Event<{ target: MinionCardModel }>;
        readonly onSilence: Event;
    };
    export type C = {
        readonly feats: MinionFeaturesModel;
        readonly role: RoleModel;
        readonly dispose: MinionDisposeModel
    };
    export type R = {};
}

@TranxUtil.span(true)
export abstract class MinionCardModel<
    E extends Partial<MinionCardModel.E & CardModel.E> & Model.E = {},
    S extends Partial<MinionCardModel.S & CardModel.S> & Model.S = {},
    C extends Partial<MinionCardModel.C & CardModel.C> & Model.C = {},
    R extends Partial<MinionCardModel.R & CardModel.R> & Model.R = {}
> extends CardModel<
    [number, MinionHooksOptions],
    E & MinionCardModel.E, 
    S & MinionCardModel.S, 
    C & MinionCardModel.C,
    R & MinionCardModel.R
> {
    public get chunk() {
        const result = super.chunk;
        return {
            ...result,
            child: { 
                ...result.child, 
                feats: this.origin.child.feats.chunk,
                role: this.origin.child.role.chunk,
            },
        }
    }

    constructor(props: MinionCardModel['props'] & {
        uuid: string | undefined;
        state: S & State<Omit<CardModel.S, 'isActive'> & MinionCardModel.S>;
        child: C & Pick<MinionCardModel.C, 'role'> & Pick<CardModel.C, 'cost'>;
        refer: R;
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { 
                feats: props.child.feats ?? new MinionFeaturesModel(),
                dispose: props.child.dispose ?? new MinionDisposeModel(),
                ...props.child 
            },
            refer: { ...props.refer },
        });
    }

    // transform
    public transform(target: MinionCardModel) {
        this.doTransform(target);
        this.event.onTransform(new Event({ target }));
    }

    @TranxUtil.span()
    private doTransform(target: MinionCardModel) {
        const board = this.route.board;
        const self: MinionCardModel = this;
        if (board) {
            const index = board.refer.queue.indexOf(self);
            board.del(self);
            board.add(target, index);
        }
    }


    // silence
    public silence() {
        this.doSilence();
        this.event.onSilence(new Event({}));
    }

    @TranxUtil.span()
    private doSilence() {
        this.child.feats.child.feats.forEach(item => item.deactive());
        this.child.feats.child.battlecry.forEach(item => item.deactive());
        this.child.feats.child.deathrattle.forEach(item => item.deactive());
        this.child.feats.child.startTurn.forEach(item => item.deactive());
        this.child.feats.child.endTurn.forEach(item => item.deactive());
        const role = this.child.role;
        role.child.feats.child.buffs.forEach(item => item.deactive());
        role.child.feats.child.feats.forEach(item => item.deactive());
        role.child.feats.child.charge.deactive();
        role.child.feats.child.divineShield.deactive();
        role.child.feats.child.elusive.deactive();
        role.child.feats.child.frozen.deactive();
        role.child.feats.child.rush.deactive();
        role.child.feats.child.stealth.deactive();
        role.child.feats.child.taunt.deactive();
        role.child.feats.child.windfury.deactive();
    }


    public async use(from: number, to: number, options: MinionHooksOptions) {
        const event = new AbortEvent({})
        this.event.toUse(event);
        if (event.detail.isAbort) return;

        const player = this.route.player;
        if (!player) return;

        // battlecry
        const feats = this.child.feats;
        const battlecry = feats.child.battlecry;
        for (const item of battlecry) {
            const params = options.battlecry.get(item);
            if (!params) continue;
            await item.run(from, to, ...params);
        }

        // end
        const board = player.child.board;
        if (!board) return;
        this.deploy(board, to);
        this.event.onUse(new Event({}));
    }


    // use
    protected async toUse(): Promise<[number, MinionHooksOptions] | undefined> {
        const to = await this.select();
        if (to === undefined) return;

        // battlecry
        const feats = this.child.feats;
        const battlecry = await MinionBattlecryModel.toRun(feats.child.battlecry);
        if (!battlecry) return;

        return [to, { battlecry }];
    }

    private async select(): Promise<number | undefined> {
        const player = this.route.player;
        if (!player) return;

        const board = player.child.board;
        const size = board.child.minions.length;
        const options = new Array(size + 1).fill(0).map((item, index) => index);
        const position = await SelectUtil.get(new SelectEvent(options, {
            desc: `Deploy ${this.name} to position`,
        }));

        return position;
    }


    // summon
    public deploy(board?: BoardModel, index?: number) {
        const player = this.route.player;
        if (!board) board = player?.child.board;
        if (!board) return;
        this.doDeploy(board, index);
        this.event.onDeploy(new Event({}));
    }

    @TranxUtil.span()
    private doDeploy(board: BoardModel, index?: number) {
        const player = this.route.player;
        const hand = player?.child.hand;
        if (hand) hand.drop(this);
        board.add(this, index);
    }
}