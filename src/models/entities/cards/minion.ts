import { Event, Method, State, TranxService, Model, DebugService, ChunkService, Emitter } from "set-piece";
import { RaceType } from "../../../types/card";
import { MinionDisposeModel } from "../../rules/dispose/minion";
import { CardModel } from ".";
import { AbortEvent } from "../../../types/events/abort";
import { BattlecryModel } from "../../features/hooks/battlecry";
import { BoardModel } from "../containers/board";
import { SleepModel } from "../../rules/sleep";
import { RoleHealthModel } from "../../rules/role-health";
import { RoleAttackModel } from "../../rules/role-attack";
import { RoleActionModel } from "../../rules/role-action";
import { MinionPerformModel } from "../../rules/perform/minion";
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
import { TurnStartModel } from "../../features/hooks/turn-start";

export namespace MinionCardModel {
    export type S = {
        readonly races: RaceType[];
    };
    export type E = {
        readonly toTransform: AbortEvent<{ target: MinionCardModel }>;
        readonly onTransform: Event<{ target: MinionCardModel }>;
        readonly onSilence: Event;
    };
    export type C = {
        readonly perform: MinionPerformModel;
        readonly dispose: MinionDisposeModel

        readonly sleep: SleepModel;
        readonly health: RoleHealthModel;
        readonly attack: RoleAttackModel;
        readonly action: RoleActionModel;
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

@TranxService.span(true)
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
        if (board || hand) {
            return {
                ...result,
                attack: this.child.attack.chunk,
                health: this.child.health.chunk,
                action: this.child.action.chunk,
                sleep: (this.child.sleep.state.isActived && Boolean(board)) || undefined,
                races: races.length ? races : undefined,
                rush: this.child.rush.state.isEnabled || undefined,
                taunt: this.child.taunt.state.isEnabled || undefined,
                charge: this.child.charge.state.isEnabled || undefined,
                frozen: this.child.frozen.state.isEnabled || undefined,
                stealth: this.child.stealth.state.isEnabled || undefined,
                elusive: this.child.elusive.state.isEnabled || undefined,
                windfury: this.child.windfury.state.isEnabled || undefined,
                divineShield: this.child.divineShield.state.isEnabled || undefined,
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
                feats: props.child.feats ?? [],
                // entries
                rush: props.child.rush ?? new RushModel({ state: { isEnabled: false }}),
                taunt: props.child.taunt ?? new TauntModel({ state: { isEnabled: false }}),
                charge: props.child.charge ?? new ChargeModel({ state: { isEnabled: false }}),
                frozen: props.child.frozen ?? new FrozenModel({ state: { isEnabled: false }}),
                stealth: props.child.stealth ?? new StealthModel({ state: { isEnabled: false }}),
                elusive: props.child.elusive ?? new ElusiveModel({ state: { isEnabled: false }}),
                windfury: props.child.windfury ?? new WindfuryModel({ state: { isEnabled: false }}),
                divineShield: props.child.divineShield ?? new DivineShieldModel({ state: { isEnabled: false }}),
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
        DebugService.log(`${this.name} Transformed to ${target.name}`);
        this.event.onTransform(new Event({ target }));
    }
    
    @TranxService.span()
    @DebugService.span()
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
        DebugService.log(`${this.name} Silenced`);
        this.event.onSilence(new Event({}));
    }


    @TranxService.span()
    private doSilence() {
        // feats
        this.child.feats.forEach(item => item.disable());
        // hooks
        this.child.battlecry.forEach(item => item.disable());
        this.child.deathrattle.forEach(item => item.disable());
        this.child.turnStart.forEach(item => item.disable());
        this.child.turnEnd.forEach(item => item.disable());
        // entries
        this.child.charge.disable();
        this.child.divineShield.disable();
        this.child.elusive.disable();
        this.child.frozen.disable();
        this.child.rush.disable();
        this.child.stealth.disable();
        this.child.taunt.disable();
        this.child.windfury.disable();
    }


    public buff(feat: BattlecryModel): void;
    public buff(feat: DeathrattleModel): void;
    public buff(feat: TurnStartModel): void;
    public buff(feat: TurnEndModel): void;
    public buff(feat: OverhealModel): void;
    public buff(feat: FeatureModel): void;
    public buff(feat: FeatureModel): void {
        const child = this.origin.child;
        if (feat instanceof BattlecryModel) child.battlecry.push(feat);
        else if (feat instanceof DeathrattleModel) child.deathrattle.push(feat);
        else if (feat instanceof TurnStartModel) child.turnStart.push(feat);
        else if (feat instanceof TurnEndModel) child.turnEnd.push(feat);
        else if (feat instanceof OverhealModel) child.overheal.push(feat);
        else child.feats.push(feat);
    }

    // summon
    public summon(board?: BoardModel, to?: number) {
        if (!board) {
            const player = this.route.player;
            if (!player) return;
            board = player.child.board;
        }
        board.summon(this, to);
    }
}