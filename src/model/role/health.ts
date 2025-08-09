import { DebugUtil, Event, EventUtil, Model, TranxUtil } from "set-piece";
import { DamageForm } from "../card/damage";
import { RoleModel } from ".";
import { GameModel } from "../game";

export namespace HealthModel {
    export type State = {
        buff: number;
        origin: number;
        damage: number;
        memory: number;
    };
    export type Event = {
        onHurt: { damage: DamageForm };
        toHurt: { damage: DamageForm };
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
    public get state() {
        const state = super.state;
        const limit = state.origin + state.buff;
        const baseline = Math.max(state.memory, limit);
        const current = Math.min(baseline - state.damage, limit);
        return { ...super.state, limit, current }
    }

    public get route() {
        const path = super.route.path;
        const game = path.find(item => item instanceof GameModel);
        const role: RoleModel | undefined = path.find(item => item instanceof RoleModel);
        return { ...super.route, role, game }
    }

    constructor(props: HealthModel['props'] & {
        state: Pick<HealthModel.State, 'origin'>;
    }) {
        super({
            uuid: props.uuid,
            state: {
                damage: 0,
                buff: 0,
                memory: props.state.origin,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public toHurt(damage: DamageForm) {
        const result = this.event.toHurt({ damage });
        return result.damage;
    }

    @TranxUtil.span()
    public doHurt(damage: DamageForm): DamageForm {
        const role = this.route.role;
        if (!role) return { ...damage, result: 0 }
        const result = damage.result;
        if (result <= 0) return { ...damage, result: 0 }
        const devineSheild = role.child.entries.child.devineSheild;
        const isAbort = devineSheild.check(damage);
        if (isAbort) return { ...damage, result: 0 }
        this.draft.state.damage += result;
        return { ...damage, result };
    }

    public onHurt(damage: DamageForm) {
        const role = this.route.role;
        role?.child.death.check(damage);
        return this.event.onHurt({ damage });
    }
    
    @EventUtil.on(self => self.proxy.event.onStateChange)
    @DebugUtil.log()
    @TranxUtil.span()
    private onStateChange(that: HealthModel, event: Event.OnStateChange<HealthModel>) {
        // console.warn('onStateChange', event.next, this);
        const { memory, limit, damage } = event.next;
        const offset = memory - limit;
        if (offset !== 0) console.warn('imbalance', memory, limit);
        if (offset !== 0) this.draft.state.memory = limit;
        if (offset > 0) this.draft.state.damage -= Math.min(damage, offset);
    }

}