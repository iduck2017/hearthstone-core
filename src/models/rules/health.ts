import { DebugUtil, Decor, Event, EventUtil, Memory, Method, Model, Producer, TranxUtil } from "set-piece";
import { RoleModel, MinionCardModel, GameModel, PlayerModel, CardModel, HeroModel } from "../..";
import { DamageEvent } from "../../types/damage";
import { RestoreEvent } from "../../types/restore";

export namespace HealthProps {
    export type E = {
        toHurt: DamageEvent;
        onHurt: DamageEvent;
        toHeal: RestoreEvent;
        onHeal: RestoreEvent;
    };
    export type S = {
        origin: number;
        offset: number;
        memory: number;
        damage: number;
    };
    export type C = {};
    export type R = {};
    export type P = {
        card: CardModel;
        minion: MinionCardModel;
        role: RoleModel;
        game: GameModel;
        hero: HeroModel;
        player: PlayerModel;
    }
}

export class HealthDecor extends Decor<HealthProps.S> {
    public add(value: number) { this.detail.offset += value }
}

export class HealthModel extends Model<
    HealthProps.E,
    HealthProps.S,
    HealthProps.C,
    HealthProps.R,
    HealthProps.P
> {
    public get state() {
        const state = super.state;
        const maxium = state.origin + state.offset;
        const baseline = Math.max(state.memory, maxium);
        return {
            ...state,
            maxium,
            current: Math.min(baseline - state.damage, maxium),
        }
    }

    constructor(loader: Method<HealthModel['props'] & {
        state: Pick<HealthProps.S, 'origin'>
    }, []>) {
        super(() => {
            const props = loader?.();
            const memory = props.state.origin + (props.state.offset ?? 0);
            return {
                uuid: props.uuid,
                state: { 
                    offset: 0,
                    damage: 0,
                    memory,
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
                route: {
                    card: CardModel.prototype,
                    minion: MinionCardModel.prototype,
                    role: RoleModel.prototype,
                    game: GameModel.prototype,
                    player: PlayerModel.prototype,
                    hero: HeroModel.prototype,
                },
            }
        });
    }

    public toHurt(event: DamageEvent) {
        const result = this.event.toHurt(event);
        return result;
    }

    @TranxUtil.span()
    public doHurt(event: DamageEvent): DamageEvent {
        const role = this.route.role;
        if (!role) return event;
        const entries = role.child.entries;
        const divineSheild = entries.child.divineShield;

        const minion = this.route.minion;
        const hero = this.route.hero;
        const dispose = minion?.child.dispose ?? hero?.child.dispose;
        if (!dispose) return event;

        let result = event.detail.result;
        if (result <= 0) {
            event.set(0)
            return event;
        }

        // armor
        if (hero) {
            const armor = hero.child.armor;
            const offset = armor.use(result);
            result = result - offset;
            event.set(result);
        }

        if (divineSheild.state.isActive) {
            divineSheild.use(event);
            event.set(0)
            return event;
        }
        this.draft.state.damage += result;
        dispose.active(false, event.detail.source, event.detail.method);
        return event;
    }

    public onHurt(event: DamageEvent) {
        const role = this.route.role;
        if (!role) return;
        if (event.isAbort) return;
        return this.event.onHurt(event);
    }


    public toHeal(event: RestoreEvent) {
        const result = this.event.toHeal(event);
        return result;
    }

    public doHeal(event: RestoreEvent): RestoreEvent {
        let result = event.detail.result;
        const role = this.route.role;
        if (!role) return event;
        if (result <= 0) {
            event.set(0)
            return event;
        }
        const damage = this.draft.state.damage;
        if (damage < result) result = damage;
        this.draft.state.damage -= result;
        event.set(result)
        return event;
    }

    public onHeal(event: RestoreEvent) {
        const role = this.route.role;
        if (!role) return;
        if (event.isAbort) return;
        if (event.detail.result <= 0) return;
        return this.event.onHeal(event);
    }


    @EventUtil.on(self => self.proxy.event.onChange)
    @DebugUtil.log()
    @TranxUtil.span()
    private onChange(that: HealthModel, event: Event) {
        const { memory, maxium, damage } = that.state;
        const offset = memory - maxium;
        if (offset !== 0) this.draft.state.memory = maxium;
        if (offset > 0) this.draft.state.damage -= Math.min(damage, offset);
    }
}