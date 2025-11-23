import { DebugUtil, Event, Method, Model, TranxUtil } from "set-piece";
import { SkillModel } from "../skill";
import { ArmorModel } from "../../rules/armor";
import { AbortEvent, DamageModel, FrozenModel, MinionCardModel, OverhealModel, RestoreModel, RoleAttackModel, RoleHealthModel, SleepModel, TurnEndModel, TurnStartModel, WeaponCardModel } from "../../..";
import { HeroDisposeModel } from "../../rules/dispose/hero";
import { RoleActionModel } from "../../rules/role-action";
import { PlayerModel } from "../player";
import { TauntModel } from "../../..";
import { StealthModel } from "../../features/entries/stealth";
import { ElusiveModel } from "../../features/entries/elusive";
import { WindfuryModel } from "../../features/entries/windfury";
import { DivineShieldModel } from "../../features/entries/divine-shield";
import { PoisonousModel } from "../../features/entries/poisonous";
import { IRoleBuffModel } from "../../features/role-buff";
import { FeatureModel } from "../../features";
import { BattlecryModel } from "../../features/hooks/battlecry";
import { DisposeModel } from "../../rules/dispose";

export type RoleModel = HeroModel | MinionCardModel;

export namespace HeroModel {
    export type E = {
        toEquip: AbortEvent<{ weapon: WeaponCardModel }>;
        onEquip: Event<{ weapon: WeaponCardModel }>;
    };
    export type S = {};
    export type C = {
        readonly armor: ArmorModel;
        readonly skill: SkillModel;
        weapon?: WeaponCardModel;

        readonly dispose: HeroDisposeModel
        readonly damage: DamageModel;
        readonly sleep: SleepModel;
        readonly health: RoleHealthModel;
        readonly attack: RoleAttackModel;
        readonly action: RoleActionModel;
        readonly restore: RestoreModel;
        readonly taunt: TauntModel;
        readonly frozen: FrozenModel;
        readonly stealth: StealthModel;
        readonly elusive: ElusiveModel;
        readonly windfury: WindfuryModel;
        readonly divineShield: DivineShieldModel;
        readonly poisonous: PoisonousModel;
        // feats
        readonly feats: FeatureModel[];
        // hooks
        readonly overheal: OverhealModel[];
        readonly turnStart: TurnStartModel[];
        readonly turnEnd: TurnEndModel[];
    };
    export type R = {};
}

export abstract class HeroModel<
    E extends Partial<HeroModel.E> & Model.E = {},
    S extends Partial<HeroModel.S> & Model.S = {},
    C extends Partial<HeroModel.C> & Model.C = {},
    R extends Partial<HeroModel.R> & Model.R = {},
> extends Model<
    E & HeroModel.E,
    S & HeroModel.S,
    C & HeroModel.C,
    R & HeroModel.R
> {
    public get route() {
        const result = super.route;
        const player: PlayerModel | undefined = result.items.find(item => item instanceof PlayerModel);
        return {
            ...result,
            player
        }
    }

    constructor(props: HeroModel['props'] & {
        state: S & HeroModel.S;
        child: C & Pick<HeroModel.C, 'skill'>;
        refer: R & HeroModel.R;
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: {
                // hooks
                overheal: props.child.overheal ?? [],
                turnStart: props.child.turnStart ?? [],
                turnEnd: props.child.turnEnd ?? [],

                sleep: props.child.sleep ?? new SleepModel(),
                health: props.child.health ?? new RoleHealthModel(),
                attack: props.child.attack ?? new RoleAttackModel(),
                action: props.child.action ?? new RoleActionModel(),
                armor: props.child.armor ?? new ArmorModel(),
                dispose: props.child.dispose ?? new HeroDisposeModel(),
                damage: props.child.damage ?? new DamageModel(),
                restore: props.child.restore ?? new RestoreModel(),

                taunt: props.child.taunt ?? new TauntModel({ state: { isEnabled: false }}),
                frozen: props.child.frozen ?? new FrozenModel({ state: { isEnabled: false }}),
                stealth: props.child.stealth ?? new StealthModel({ state: { isEnabled: false }}),
                elusive: props.child.elusive ?? new ElusiveModel({ state: { isEnabled: false }}),
                windfury: props.child.windfury ?? new WindfuryModel({ state: { isEnabled: false }}),
                divineShield: props.child.divineShield ?? new DivineShieldModel({ state: { isEnabled: false }}),
                poisonous: props.child.poisonous ?? new PoisonousModel({ state: { isEnabled: false }}),

                feats: props.child.feats ?? [],
                ...props.child,
            },
            refer: { ...props.refer }
        })
    }

    public buff(feat: IRoleBuffModel): void
    public buff(feat: BattlecryModel): void
    public buff(feat: OverhealModel): void
    public buff(feat: TurnStartModel): void
    public buff(feat: TurnEndModel): void
    public buff(feat: FeatureModel): void {
        const child = this.origin.child;
        if (feat instanceof OverhealModel) child.overheal.push(feat);
        else child.feats.push(feat);
    }

    @DisposeModel.span()
    public equip(weapon: WeaponCardModel) {
        const event = new AbortEvent({ weapon });
        this.event.toEquip(event);
        const isValid = event.detail.isValid;
        if (!isValid) return;

        const prev = this.origin.child.weapon;
        if (prev) prev.child.dispose.destroy();
        this.doEquip(weapon);

        DebugUtil.log(`${weapon.name} Equipped`);
        this.event.onEquip(new Event({ weapon }));
    }

    @TranxUtil.span()
    private doEquip(next: WeaponCardModel) {
        const player = this.route.player;
        if (!player) return;
        const graveyard = player.child.graveyard;

        const child = this.origin.child;
        const prev = child.weapon;
        if (prev) {
            child.weapon = undefined;
            graveyard.add(prev);
        }

        const hand = next.route.hand;
        if (hand) hand.del(next);
        const deck = next.route.deck;
        if (deck) deck.del(next);
        const cache = next.route.cache;
        if (cache) cache.del(next);
        child.weapon = next;
    }


    public unequip(weapon: WeaponCardModel) {
        if (this.origin.child.weapon !== weapon) return;
        this.origin.child.weapon = undefined;
    }
}