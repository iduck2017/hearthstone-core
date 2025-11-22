import { DebugUtil, Event, Model, TranxUtil } from "set-piece";
import { CardModel } from ".";
import { WeaponAttackModel } from "../../features/rules/weapon-attack";
import { WeaponActionModel } from "../../features/rules/weapon-action";
import { WeaponDisposeModel } from "../../features/dispose/weapon";
import { FeatureModel } from "../../features";
import { BattlecryModel } from "../../features/hooks/battlecry";
import { TurnEndModel } from "../../features/hooks/turn-end";
import { WeaponPerformModel } from "../../features/perform/weapon";
import { DeathrattleModel } from "../../features/hooks/deathrattle";
import { TurnStartModel } from "../../features/hooks/turn-start";
import { PlayerModel } from "../player";
import { AbortEvent } from "../../../types/events/abort";
import { DisposeModel } from "../../features/dispose";

export namespace WeaponCardModel {
    export type S = {};
    export type E = {
        toEquip: AbortEvent;
        onEquip: Event;
    };
    export type C = {
        readonly attack: WeaponAttackModel;
        readonly action: WeaponActionModel;

        readonly perform: WeaponPerformModel;
        readonly dispose: WeaponDisposeModel;

        readonly feats: FeatureModel[];
        readonly battlecry: BattlecryModel[];
        readonly deathrattle: DeathrattleModel[];
    };
    export type R = {};
}

@TranxUtil.span(true)
export abstract class WeaponCardModel<
    E extends Partial<WeaponCardModel.E & CardModel.E> & Model.E = {},
    S extends Partial<WeaponCardModel.S & CardModel.S> & Model.S = {},
    C extends Partial<WeaponCardModel.C & CardModel.C> & Model.C = {},
    R extends Partial<WeaponCardModel.R & CardModel.R> & Model.R = {}
> extends CardModel<
    E & WeaponCardModel.E,
    S & WeaponCardModel.S,
    C & WeaponCardModel.C,
    R & WeaponCardModel.R
> {
    public get chunk() {
        const result = super.chunk;
        const hand = this.route.hand;
        const board = this.route.board;
        if (hand || board) {
            return {
                ...result,
                attack: this.child.attack.chunk,
                durability: this.child.action.chunk,
            }
        }
        return {
            ...result,
            attack: this.child.attack.state.origin,
            durability: this.child.action.state.origin,
        }
    }

    constructor(props: WeaponCardModel['props'] & {
        state: S & WeaponCardModel.S & CardModel.S;
        child: C & Pick<WeaponCardModel.C, 'attack' | 'action'> & Pick<CardModel.C, 'cost'>;
        refer: R & WeaponCardModel.R;
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: {
                perform: props.child.perform ?? new WeaponPerformModel(),
                dispose: props.child.dispose ?? new WeaponDisposeModel(),
                feats: props.child.feats ?? [],
                battlecry: props.child.battlecry ?? [],
                deathrattle: props.child.deathrattle ?? [],
                turnStart: props.child.turnStart ?? [],
                turnEnd: props.child.turnEnd ?? [],
                ...props.child,
            },
            refer: { ...props.refer },
        })
    }


    public buff(feat: BattlecryModel): void;
    public buff(feat: DeathrattleModel): void;
    public buff(feat: TurnStartModel): void;
    public buff(feat: TurnEndModel): void;
    public buff(feat: FeatureModel): void;
    public buff(feat: FeatureModel): void {
        const child = this.origin.child;
        if (feat instanceof BattlecryModel) child.battlecry.push(feat);
        else if (feat instanceof TurnStartModel) child.turnStart.push(feat);
        else if (feat instanceof TurnEndModel) child.turnEnd.push(feat);
        else if (feat instanceof DeathrattleModel) child.deathrattle.push(feat);
        else if (feat instanceof FeatureModel) child.feats.push(feat);
    }

    // equip
    @DisposeModel.span()
    public equip(player?: PlayerModel, index?: number) {
        if (!player) player = this.route.player;
        if (!player) return;

        // before
        const event = new AbortEvent({ player });
        this.event.toEquip(event);
        const isValid = event.detail.isValid;
        if (!isValid) return;

        // execute
        const hero = player.child.hero;
        const prev = hero.child.weapon;
        if (prev) prev.child.dispose.destroy();
        this.doEquip(player);
        
        // after
        DebugUtil.log(`${this.name} Equipped`);
        this.event.onEquip(new Event({}));
    }

    @TranxUtil.span()
    private doEquip(player: PlayerModel) {
        const hand = player.child.hand;
        if (hand) hand.del(this);
        const hero = player.child.hero;
        hero.equip(this);
    }
    
}