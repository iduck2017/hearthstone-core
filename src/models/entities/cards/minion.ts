import { Event, Method, State, TranxUtil, Model, DebugUtil, TemplUtil, Emitter } from "set-piece";
import { RaceType } from "../../../types/card";
import { MinionDisposeModel } from "../../features/dispose/minion";
import { CardModel } from ".";
import { AbortEvent } from "../../../types/events/abort";
import { BattlecryModel } from "../../features/hooks/battlecry";
import { BoardModel } from "../containers/board";
import { SleepModel } from "../../features/rules/sleep";
import { RoleHealthModel } from "../../features/rules/role-health";
import { RoleAttackModel } from "../../features/rules/role-attack";
import { RoleActionModel } from "../../features/rules/role-action";
import { MinionPerformModel } from "../../features/perform/minion";
import { IRoleBuffModel } from "../../features/rules/i-role-buff";
import { RoleFeatureModel } from "../../features/minion";
import { RushModel } from "../../features/entries/rush";
import { TauntModel } from "../../features/entries/taunt";
import { ChargeModel } from "../../features/entries/charge";
import { FrozenModel } from "../../features/entries/frozen";
import { StealthModel } from "../../features/entries/stealth";
import { ElusiveModel } from "../../features/entries/elusive";
import { WindfuryModel } from "../../features/entries/windfury";
import { DivineShieldModel } from "../../features/entries/divine-shield";
import { TurnEndModel } from "../../features/hooks/turn-end";
import { DeathrattleModel } from "../../features/hooks/deathrattle";
import { OverhealModel } from "../../features/hooks/overheal";
import { FeatureModel } from "../../features";
import { CardFeatureModel } from "../../features/card";
import { TurnStartModel } from "../../features/hooks/turn-start";

export namespace MinionCardModel {
    export type S = {
        readonly races: RaceType[];
    };
    export type E = {
        readonly toTransform: AbortEvent<{ target: MinionCardModel }>;
        readonly onTransform: Event<{ target: MinionCardModel }>;
        readonly onSilence: Event;
        readonly toSummon: AbortEvent<{ board: BoardModel; to?: number }>;
        readonly onSummon: Event;
    };
    export type C = {
        readonly perform: MinionPerformModel;
        readonly dispose: MinionDisposeModel

        readonly sleep: SleepModel;
        readonly health: RoleHealthModel;
        readonly attack: RoleAttackModel;
        readonly action: RoleActionModel;
        // feats
        readonly buffs: IRoleBuffModel[];
        // entries
        readonly rush: RushModel;
        readonly taunt: TauntModel;
        readonly charge: ChargeModel;
        readonly frozen: FrozenModel;
        readonly stealth: StealthModel;
        readonly elusive: ElusiveModel;
        readonly windfury: WindfuryModel;
        readonly divineShield: DivineShieldModel;
        // hooks
        readonly battlecry: BattlecryModel[];
        readonly overheal: OverhealModel[];
        readonly deathrattle: DeathrattleModel[];
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
        const buffs = this.child.buffs.map(item => item.chunk);
        if (board || hand) {
            return {
                ...result,
                attack: this.child.attack.chunk,
                health: this.child.health.chunk,
                action: this.child.action.chunk,
                sleep: (this.child.sleep.state.isActived && Boolean(board)) || undefined,
                races: races.length ? races : undefined,
                buffs: buffs.length ? buffs : undefined,
                rush: this.child.rush.state.isActived || undefined,
                taunt: this.child.taunt.state.isActived || undefined,
                charge: this.child.charge.state.isActived || undefined,
                frozen: this.child.frozen.state.isActived || undefined,
                stealth: this.child.stealth.state.isActived || undefined,
                elusive: this.child.elusive.state.isActived || undefined,
                windfury: this.child.windfury.state.isActived || undefined,
                divineShield: this.child.divineShield.state.isActived || undefined,
            }
        }
        return {
            ...result,
            attack: this.child.attack.state.origin,
            health: this.child.health.state.origin,
            races: races.length ? races : undefined,
        }
    }

    constructor(props: MinionCardModel['props'] & {
        uuid: string | undefined;
        state: S & State<CardModel.S & MinionCardModel.S>;
        child: C & Pick<CardModel.C, 'cost'>;
        refer: R;
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { 
                perform: props.child.perform ?? new MinionPerformModel(),
                sleep: props.child.sleep ?? new SleepModel(),
                health: props.child.health ?? new RoleHealthModel(),
                attack: props.child.attack ?? new RoleAttackModel(),
                action: props.child.action ?? new RoleActionModel(),
                dispose: props.child.dispose ?? new MinionDisposeModel(),
                // feats
                buffs: props.child.buffs ?? [],
                feats: props.child.feats ?? [],
                // entries
                rush: props.child.rush ?? new RushModel({ state: { isActived: false }}),
                taunt: props.child.taunt ?? new TauntModel({ state: { isActived: false }}),
                charge: props.child.charge ?? new ChargeModel({ state: { isActived: false }}),
                frozen: props.child.frozen ?? new FrozenModel({ state: { isActived: false }}),
                stealth: props.child.stealth ?? new StealthModel({ state: { isActived: false }}),
                elusive: props.child.elusive ?? new ElusiveModel({ state: { isActived: false }}),
                windfury: props.child.windfury ?? new WindfuryModel({ state: { isActived: false }}),
                divineShield: props.child.divineShield ?? new DivineShieldModel({ state: { isActived: false }}),
                // hooks
                battlecry: props.child.battlecry ?? [],
                overheal: props.child.overheal ?? [],
                deathrattle: props.child.deathrattle ?? [],
                ...props.child 
            },
            refer: { ...props.refer },
        });
    }

    // transform
    public transform(target: MinionCardModel) {
        // before
        const event = new AbortEvent({ target });
        this.event.toTransform(event);
        const isValid = event.detail.isValid;
        if (!isValid) return;

        // execute
        this.doTransform(target);
        
        // after
        DebugUtil.log(`${this.name} Transformed to ${target.name}`);
        this.event.onTransform(new Event({ target }));
    }
    
    @TranxUtil.span()
    @DebugUtil.span()
    private doTransform(target: MinionCardModel): boolean {
        const board = this.route.board;
        const self: MinionCardModel = this;
        if (board) {
            const index = board.child.cards.indexOf(self);
            board.del(self);
            board.add(target, index);
        }
        return true;
    }


    // silence
    public silence() {
        this.doSilence();
        // after
        DebugUtil.log(`${this.name} Silenced`);
        this.event.onSilence(new Event({}));
    }


    @TranxUtil.span()
    private doSilence() {
        // feats
        this.child.feats.forEach(item => item.deactive());
        this.child.buffs.forEach(item => item.deactive());
        // hooks
        this.child.battlecry.forEach(item => item.deactive());
        this.child.deathrattle.forEach(item => item.deactive());
        this.child.turnStart.forEach(item => item.deactive());
        this.child.turnEnd.forEach(item => item.deactive());
        // entries
        this.child.charge.deactive();
        this.child.divineShield.deactive();
        this.child.elusive.deactive();
        this.child.frozen.deactive();
        this.child.rush.deactive();
        this.child.stealth.deactive();
        this.child.taunt.deactive();
        this.child.windfury.deactive();
    }


    public buff(feat: IRoleBuffModel): void;
    public buff(feat: BattlecryModel): void;
    public buff(feat: DeathrattleModel): void;
    public buff(feat: TurnStartModel): void;
    public buff(feat: TurnEndModel): void;
    public buff(feat: OverhealModel): void;
    public buff(feat: CardFeatureModel): void;
    public buff(feat: CardFeatureModel): void {
        const child = this.origin.child;
        if (feat instanceof IRoleBuffModel) child.buffs.push(feat);
        else if (feat instanceof BattlecryModel) child.battlecry.push(feat);
        else if (feat instanceof DeathrattleModel) child.deathrattle.push(feat);
        else if (feat instanceof TurnStartModel) child.turnStart.push(feat);
        else if (feat instanceof TurnEndModel) child.turnEnd.push(feat);
        else if (feat instanceof OverhealModel) child.overheal.push(feat);
        else if (feat instanceof FeatureModel) child.feats.push(feat);
    }

    
    // summon
    public summon(board?: BoardModel, to?: number) {
        // before
        const player = this.route.player;
        if (!board) board = player?.child.board;
        if (!board) return;

        // precheck board
        const cards = board.child.cards;
        if (cards.length >= 7) return;
        
        // precheck source
        const hand = this.route.hand;
        if (hand && !hand.has(this)) return;
        const deck = this.route.deck;
        if (deck && !deck.has(this)) return;
        const cache = this.route.cache;
        if (cache && !cache.has(this)) return;

        const event = new AbortEvent({ board, to });
        this.event.toSummon(event);
        let isValid = event.detail.isValid;
        if (!isValid) return;

        // execute
        this.doSummon(board, to);
        
        // after
        DebugUtil.log(`${this.name} Summoned`);
        this.event.onSummon(new Event({}));
    }


    @TranxUtil.span()
    public doSummon(board: BoardModel, to?: number) {
        const hand = this.route.hand;
        if (hand) hand.del(this);

        const deck = this.route.deck;
        if (deck) deck.del(this);
        const cache = this.route.cache;
        if (cache) cache.del(this);
        board.add(this, to);
    }

}