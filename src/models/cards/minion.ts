import { Event, Method, State, TranxUtil, Model, DebugUtil } from "set-piece";
import { MinionHooksConfig, MinionFeaturesModel } from "../features/group/minion";
import { RaceType } from "../../types/card-enums";
import { MinionDisposeModel } from "./dispose/minion";
import { CardModel } from ".";
import { AbortEvent } from "../../types/abort-event";
import { MinionBattlecryModel } from "../features/hooks/minion-battlecry";
import { BoardModel } from "./group/board";
import { Selector } from "../rules/selector";
import { SleepModel } from "../rules/role/sleep";
import { RoleHealthModel } from "../rules/role/health";
import { RoleAttackModel } from "../rules/role/attack";
import { RoleActionModel } from "../rules/role/action";
import { MinionPlayModel } from "./minion-play";

export namespace MinionCardModel {
    export type S = {
        readonly races: RaceType[];
    };
    export type E = {
        readonly onTransform: Event<{ target: MinionCardModel }>;
        readonly onSilence: Event;
    };
    export type C = {
        readonly play: MinionPlayModel;
        readonly dispose: MinionDisposeModel

        readonly sleep: SleepModel;
        readonly health: RoleHealthModel;
        readonly attack: RoleAttackModel;
        readonly action: RoleActionModel;
        readonly feats: MinionFeaturesModel;
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
    [number, MinionHooksConfig],
    E & MinionCardModel.E, 
    S & MinionCardModel.S, 
    C & MinionCardModel.C,
    R & MinionCardModel.R
> {
    public get chunk() {
        const result = super.chunk;
        const board = this.route.board;
        const hand = this.route.hand;
        const races = this.state.races;
        if (board || hand) {
            return {
                ...result,
                attack: this.child.attack.chunk,
                health: this.child.health.chunk,
                action: this.child.action.chunk,
                sleep: (this.child.sleep.state.isActive && Boolean(board)) || undefined,
                races: races.length ? races : undefined,
            }
        }
        return {
            ...result,
            attack: this.child.attack.state.origin,
            health: this.child.health.state.origin,
            races: races.length ? races : undefined,
        }
    }

    public get status(): boolean {
        if (!super.status) return false;
        // board size
        const player = this.route.player;
        const board = player?.child.board;
        if (!board) return false;
        if (board.child.cards.length >= 7) return false;
        return true;
    }

    constructor(props: MinionCardModel['props'] & {
        uuid: string | undefined;
        state: S & State<Omit<CardModel.S, 'isActive'> & MinionCardModel.S>;
        child: C & Pick<CardModel.C, 'cost'>;
        refer: R;
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { 
                play: props.child.play ?? new MinionPlayModel(),
                sleep: props.child.sleep ?? new SleepModel(),
                health: props.child.health ?? new RoleHealthModel(),
                attack: props.child.attack ?? new RoleAttackModel(),
                action: props.child.action ?? new RoleActionModel(),
                feats: props.child.feats ?? new MinionFeaturesModel(),
                dispose: props.child.dispose ?? new MinionDisposeModel(),
                ...props.child 
            },
            refer: { ...props.refer },
        });
    }

    // transform
    public transform(target: MinionCardModel) {
        DebugUtil.log(`${this.name} Transformed to ${target.name}`);
        this.doTransform(target);
        this.event.onTransform(new Event({ target }));
    }

    @TranxUtil.span()
    @DebugUtil.span()
    private doTransform(target: MinionCardModel) {
        const board = this.route.board;
        const self: MinionCardModel = this;
        if (board) {
            const index = board.child.cards.indexOf(self);
            board.del(self);
            board.add(target, index);
        }
    }


    // silence
    public silence() {
        DebugUtil.log(`${this.name} Silenced`);
        this.doSilence();
        this.event.onSilence(new Event({}));
    }

    @TranxUtil.span()
    @DebugUtil.span()
    private doSilence() {
        // feats
        this.child.feats.child.items.forEach(item => item.deactive());
        this.child.feats.child.buffs.forEach(item => item.deactive());
        // hooks
        this.child.feats.child.battlecry.forEach(item => item.deactive());
        this.child.feats.child.deathrattle.forEach(item => item.deactive());
        this.child.feats.child.startTurn.forEach(item => item.deactive());
        this.child.feats.child.endTurn.forEach(item => item.deactive());
        // entries
        this.child.feats.child.charge.deactive();
        this.child.feats.child.divineShield.deactive();
        this.child.feats.child.elusive.deactive();
        this.child.feats.child.frozen.deactive();
        this.child.feats.child.rush.deactive();
        this.child.feats.child.stealth.deactive();
        this.child.feats.child.taunt.deactive();
        this.child.feats.child.windfury.deactive();
    }


    public use(from: number, to: number, config: MinionHooksConfig) {
        const event = new AbortEvent({})
        this.event.toUse(event);
        if (event.detail.isAbort) return;

        const player = this.route.player;
        if (!player) return;

        // battlecry
        this.child.play.run(from, to, config);
    }

    public onUse(from: number, to: number, config: MinionHooksConfig) {
        const player = this.route.player;
        if (!player) return;
        // end
        const board = player.child.board;
        if (!board) return;
        this.deploy(board, to);
        this.event.onUse(new Event({}));
        this.onPlay(from, to, config);
    }


    // use
    protected async toUse(): Promise<[number, MinionHooksConfig] | undefined> {
        const to = await this.toDeploy();
        if (to === undefined) return;

        const player = this.route.player;
        if (!player) return;

        // battlecry
        const feats = this.child.feats;
        const battlecry = await MinionBattlecryModel.toRun(player, feats.child.battlecry);
        if (!battlecry) return;

        return [to, { battlecry }];
    }

    private async toDeploy(): Promise<number | undefined> {
        const player = this.route.player;
        if (!player) return;

        const board = player.child.board;
        const size = board.child.cards.length;
        const options = new Array(size + 1).fill(0).map((item, index) => index);
        const position = await player.child.controller.get(
            new Selector(options, { desc: `Deploy ${this.name} at certain position` }
        ));
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
        DebugUtil.log(`${this.name} Summoned`);
        const player = this.route.player;
        const hand = player?.child.hand;
        if (hand) hand.drop(this);
        board.add(this, index);
    }
}