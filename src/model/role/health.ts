import { DebugUtil, Event, EventUtil, Model, TranxUtil } from "set-piece";
import { DamageForm } from "../damage";
import { RoleModel } from ".";
import { MinionCardModel } from "../card/minion";
import { GameModel } from "../game";
import { PlayerModel } from "../player";

export namespace HealthModel {
    export type Event = {
        toHurt: DamageForm;
        onHurt: DamageForm;
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


    public toHurt(form: DamageForm) {
        return this.event.toHurt(form);
    }

    @TranxUtil.span()
    public doHurt(form: DamageForm): DamageForm {
        const result = form.result;
        const role = this.route.role;
        if (!role) return form;
        const devineShield = role.child.devineShield;
        const death = role.child.death;
        if (result <= 0) return { ...form, result: 0 }
        if (devineShield.state.isActive) {
            devineShield.deactive();
            return { ...form, result: 0 }
        }
        this.draft.state.damage += result;
        if (this.state.current <= result) death.toDie(form);
        return { ...form, result };
    }

    public onHurt(form: DamageForm) {
        return this.event.onHurt(form);
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
