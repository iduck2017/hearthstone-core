import { DebugUtil, Event, EventUtil, Model, TranxUtil } from "set-piece";
import { DamageEvent } from "../../utils/damage";
import { RoleModel } from ".";
import { MinionCardModel } from "../card/minion";
import { GameModel } from "../game";
import { PlayerModel } from "../player";
import { RestoreEvent } from "../..";

export namespace HealthModel {
    export type Event = {
        toHurt: DamageEvent;
        onHurt: DamageEvent;
        toHeal: RestoreEvent;
        onHeal: RestoreEvent;
    };
    export type State = {
        origin: number;
        offset: number;
        memory: number;
        damage: number;
    };
    export type Child = {};
    export type Refer = {};
}


export class HealthModel extends Model<
    HealthModel.Event,
    HealthModel.State,
    HealthModel.Child,
    HealthModel.Refer
> {
    public get route() {
        const route = super.route;
        const role: RoleModel | undefined = route.path.find(item => item instanceof RoleModel);
        const card: MinionCardModel | undefined = route.path.find(item => item instanceof MinionCardModel);
        return { 
            ...route, 
            role,
            card,
            game: route.path.find(item => item instanceof GameModel),
            player: route.path.find(item => item instanceof PlayerModel),
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

    constructor(props: HealthModel['props'] & {
        state: Pick<HealthModel.State, 'origin'>
    }) {
        super({
            uuid: props.uuid,
            state: { 
                offset: 0,
                damage: 0,
                memory: props.state.origin + (props.state?.offset ?? 0),
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }


    public toHurt(event: DamageEvent) {
        const result = this.event.toHurt(event);
        return result;
    }

    @TranxUtil.span()
    public doHurt(event: DamageEvent): DamageEvent {
        const result = event.result;
        const role = this.route.role;
        if (!role) return event;
        const entries = role.child.entries;
        const divineSheild = entries.child.divineShield;
        const death = role.child.death;
        const health = this.state.current;
        if (result <= 0) {
            event.result = 0;
            return event;
        }
        if (divineSheild.state.status) {
            divineSheild.break();
            event.result = 0;
            return event;
        }
        console.log('doHurt');
        this.draft.state.damage += result;
        if (health <= result) death.active(event);
        event.result = result;
        return event;
    }

    public onHurt(event: DamageEvent) {
        const role = this.route.role;
        if (!role) return;
        if (event.isAbort) return;
        if (event.isBlock) {
            const entries = role.child.entries;
            const divineSheild = entries.child.divineShield;
            divineSheild.onBreak(event);
            return;
        }
        return this.event.onHurt(event);
    }



    public toHeal(event: RestoreEvent) {
        const result = this.event.toHeal(event);
        return result;
    }

    public doHeal(event: RestoreEvent): RestoreEvent {
        let result = event.result;
        const role = this.route.role;
        if (!role) return event;
        const death = role.child.death;
        if (result <= 0) {
            event.result = 0;
            return event;
        }
        const damage = this.draft.state.damage;
        const health = this.state.current;
        if (damage < result) result = damage;
        this.draft.state.damage -= result;
        if (health + result > 0) death.cancel(); 
        event.result = result;
        return event;
    }

    public onHeal(event: RestoreEvent) {
        const role = this.route.role;
        if (!role) return;
        if (event.isAbort) return;
        if (event.result <= 0) return;
        return this.event.onHeal(event);
    }


    @EventUtil.on(self => self.proxy.event.onStateChange)
    @DebugUtil.log()
    @TranxUtil.span()
    private balance(that: HealthModel, event: Event.OnStateChange<HealthModel>) {
        const { memory, limit, damage } = event.next;
        const offset = memory - limit;
        if (offset !== 0) console.log('imbalance', memory, limit);
        if (offset !== 0) this.draft.state.memory = limit;
        if (offset > 0) this.draft.state.damage -= Math.min(damage, offset);
    }
}
