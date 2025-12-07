import { DebugUtil, Event, EventUtil, Frame, Model, TemplUtil, TranxUtil } from "set-piece";
import { MinionCardModel, HeroModel } from "../..";
import { DamageEvent } from "../../types/events/damage";
import { RestoreEvent } from "../../types/events/restore";
import { RoleHealthDecor } from "../../types/decors/role-health";

export namespace RoleHealthModel {
    export type E = {
        toConsume: DamageEvent;
        onConsume: DamageEvent;
        toRestore: RestoreEvent;
        onRestore: RestoreEvent;
    };
    export type S = {
        origin: number;
        minimum?: number;
        maximum: number;
        memory: number;
        damage: number;
    };
    export type C = {};
    export type R = {};
}


@TemplUtil.is('role-health')
export class RoleHealthModel extends Model<
    RoleHealthModel.E,
    RoleHealthModel.S,
    RoleHealthModel.C,
    RoleHealthModel.R
> {
    public get route() {
        const result = super.route;
        const hero: HeroModel | undefined = result.items.find(item => item instanceof HeroModel);
        const minion: MinionCardModel | undefined = result.items.find(item => item instanceof MinionCardModel);
        return {
            ...result,
            role: hero ?? minion,
            hero,
            minion,
        }
    }

    public get chunk() {
        return {
            current: this.state.current,
            origin: this.state.origin,
            maximum: this.state.maximum,
        }
    }

    public get decor(): RoleHealthDecor { return new RoleHealthDecor(this); }

    public get state() {
        const state = super.state;
        const baseline = Math.max(state.memory, state.maximum);
        const current = Math.min(baseline - state.damage, state.maximum);
        const isAlive = current > 0;
        const isInjured = current < state.maximum;
        return {
            ...state,
            current,
            isAlive,
            isInjured,
        }
    }

    constructor(props?: RoleHealthModel['props']) {
        const state = props?.state ?? {};
        const maximum = state.maximum ?? state.origin ?? 0;
        const memory = state.memory ?? maximum ?? 0;
        super({
            uuid: props?.uuid,
            state: { 
                origin: 0,
                damage: 0,
                memory,
                maximum,
                ...props?.state,
            },
            child: { ...props?.child },
            refer: { ...props?.refer },
        });
    }

    public toConsume(event: DamageEvent): boolean {
        this.event.toConsume(event);
        const isValid = event.detail.isValid;
        if (!isValid) return false;
        return true
    }

    @TranxUtil.span()
    public doComsume(event: DamageEvent): DamageEvent {

        const role = this.route.role;
        if (!role) return event;

        const source = event.detail.source;
        const hero = this.route.hero;
        const minion = this.route.minion;
        const dispose = role.child.dispose;

        let result = event.detail.result;
        if (result <= 0) {
            event.update(0)
            return event;
        }
        /** @todo move outside */
        // armor
        if (hero) {
            const armor = hero.child.armor;
            const offset = armor.consume(result);
            result = result - offset;
            event.update(result);
        }


        /** @todo move outside */
        // poisonous
        const poisonous = source.child.poisonous;
        if (poisonous.state.isEnabled && minion) event.supplement({ isPoisonous: true });

        // minium
        const current = this.state.current;
        if (this.state.minimum !== undefined) {
            result = Math.min(result, current - this.state.minimum);
            event.update(result);
        }
        this.origin.state.damage += result;


        DebugUtil.log(`${role.name} receive ${result} Damage`);
        dispose.check(event.detail.source);
        return event;
    }

    public onConsume(event: DamageEvent) {
        const role = this.route.role;
        if (!role) return;

        const isValid = event.detail.isValid;
        if (!isValid) return;

        const minion = this.route.minion;
        const isPoisonous = event.detail.detail.isPoisonous;
        if (isPoisonous && minion) {
            const source = event.detail.source;
            const method = event.detail.method;
            const dispose = minion.child.dispose;
            DebugUtil.log(`${minion.name} Die by Poisonous`);
            dispose.destroy(source, method);
        }

        return this.event.onConsume(event);
    }


    public toRestore(event: RestoreEvent) {
        this.event.toRestore(event);
    }

    public restore(event: RestoreEvent): RestoreEvent {
        let result = event.detail.result;
        const role = this.route.role;
        if (!role) return event;
        if (result <= 0) {
            event.update(0)
            return event;
        }
        const damage = this.origin.state.damage;
        const restore = Math.min(damage, result);
        const overflow = Math.max(0, result - damage);
        if (restore > 0) DebugUtil.log(`${role.name} restore ${restore} Health`);
        this.origin.state.damage -= restore;
        event.update(restore, overflow);
        return event;
    }

    public onRestore(event: RestoreEvent) {
        const role = this.route.role;
        if (!role) return;

        const isValid = event.detail.isValid;
        if (!isValid) return;
        if (event.detail.result > 0) this.event.onRestore(event);
        if (event.detail.overflow > 0) {
            const overheal = role.child.overheal;
            overheal.forEach(item => item.run());
        }
    }
    


    @EventUtil.on(self => self.handleChange)
    private listenChange() {
        const self: RoleHealthModel = this;
        return self.proxy.event?.onChange;
    }
    @TranxUtil.span()
    private handleChange(that: this, event: Event<Frame<RoleHealthModel>>) {
        const { memory, maximum, damage } = that.state;
        const offset = memory - maximum;
        if (offset !== 0) this.origin.state.memory = maximum;
        if (offset > 0) this.origin.state.damage -= Math.min(damage, offset);
    }
}