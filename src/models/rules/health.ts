import { DebugUtil, Event, EventUtil, Method, Model, StateChangeEvent, TranxUtil } from "set-piece";
import { RoleModel } from "../role";
import { GameModel } from "../game";
import { PlayerModel } from "../player";
import { MinionModel } from "../..";
import { CardModel } from "../cards";
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
}


export class HealthModel extends Model<
    HealthProps.E,
    HealthProps.S,
    HealthProps.C,
    HealthProps.R
> {
    public get route() {
        const route = super.route;
        const card: CardModel | undefined = route.order.find(item => item instanceof CardModel);
        const minion: MinionModel | undefined = route.order.find(item => item instanceof MinionModel);
        return { 
            ...route, 
            card,
            minion,
            role: route.order.find(item => item instanceof RoleModel),
            game: route.order.find(item => item instanceof GameModel),
            player: route.order.find(item => item instanceof PlayerModel),
        }
    }

    public get state() {
        const state = super.state;
        const limit = state.origin + state.offset;
        const baseline = Math.max(state.memory, limit);
        return {
            ...state,
            limit,
            current: Math.min(baseline - state.damage, limit),
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
            }
        });
    }


    public toHurt(event: DamageEvent) {
        const result = this.event.toHurt(event);
        return result;
    }

    @TranxUtil.span()
    public doHurt(event: DamageEvent): DamageEvent {
        const result = event.detail.result;
        const role = this.route.role;
        if (!role) return event;
        const entries = role.child.entries;
        const divineSheild = entries.child.divineShield;
        const death = role.child.death;
        const health = this.state.current;
        if (result <= 0) {
            event.reset(0);
            return event;
        }
        if (divineSheild.state.status) {
            divineSheild.consume();
            event.reset(0);
            return event;
        }
        this.draft.state.damage += result;
        if (health <= result) death.active(event);
        event.reset(result);
        return event;
    }

    public onHurt(event: DamageEvent) {
        const role = this.route.role;
        if (!role) return;
        if (event.isCancel) return;
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
        const death = role.child.death;
        if (result <= 0) {
            event.reset(0);
            return event;
        }
        const damage = this.draft.state.damage;
        const health = this.state.current;
        if (damage < result) result = damage;
        this.draft.state.damage -= result;
        if (health + result > 0) death.cancel(); 
        event.reset(result);
        return event;
    }

    public onHeal(event: RestoreEvent) {
        const role = this.route.role;
        if (!role) return;
        if (event.isCancel) return;
        if (event.detail.result <= 0) return;
        return this.event.onHeal(event);
    }


    @EventUtil.on(self => self.proxy.event.onStateChange)
    @DebugUtil.log()
    @TranxUtil.span()
    private onCheck(that: HealthModel, event: StateChangeEvent<HealthModel>) {
        const { memory, limit, damage } = event.detail.next;
        const offset = memory - limit;
        if (offset !== 0) console.log('imbalance', memory, limit);
        if (offset !== 0) this.draft.state.memory = limit;
        if (offset > 0) this.draft.state.damage -= Math.min(damage, offset);
    }
}
