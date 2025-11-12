import { DebugUtil, Decor, Event, EventUtil, Frame, Method, Model, StateUtil, TemplUtil, TranxUtil } from "set-piece";
import { MinionCardModel, GameModel, PlayerModel, CardModel, HeroModel, IRoleBuffModel } from "../../..";
import { DamageEvent } from "../../../types/damage-event";
import { RestoreEvent } from "../../../types/restore-event";
import { OperatorType } from "../../../types/operator";
import { Operator } from "../../../types/operator";

export namespace RoleHealthModel {
    export type E = {
        toHurt: DamageEvent;
        onHurt: DamageEvent;
        toHeal: RestoreEvent;
        onHeal: RestoreEvent;
    };
    export type S = {
        origin: number;
        maximum: number;
        memory: number;
        damage: number;
    };
    export type C = {};
    export type R = {};
}

export class RoleHealthDecor extends Decor<RoleHealthModel.S> {
    private operations: Operator[] = [];

    public get result() {
        const result = { ...this._origin };
        const buffs = this.operations
            .filter(item => item.reason instanceof IRoleBuffModel)
            .sort((a, b) => a.reason.uuid.localeCompare(b.reason.uuid));
        buffs.forEach(item => {
            if (item.type === OperatorType.ADD) result.maximum += item.offset;
            if (item.type === OperatorType.SET) result.maximum = item.offset;
        })
        const items = this.operations.filter(item => !(item.reason instanceof IRoleBuffModel));
        items.forEach(item => {
            if (item.type === OperatorType.ADD) result.maximum += item.offset;
            if (item.type === OperatorType.SET) result.maximum = item.offset;
        })
        if (result.maximum <= 0) result.maximum = 0;
        return result;
    }
    
    public add(operation: Operator) { 
        this.operations.push(operation);
    }
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
        return {
            ...state,
            current: Math.min(baseline - state.damage, state.maximum),
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

    public toHurt(event: DamageEvent) {
        this.event.toHurt(event);
    }

    @TranxUtil.span()
    public doHurt(event: DamageEvent): DamageEvent {
        const role = this.route.role;
        if (!role) return event;

        const entries = role.child.feats;
        const divineSheild = entries.child.divineShield;
        const source = event.detail.source;

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
            const offset = armor.consume(result);
            result = result - offset;
            event.set(result);
        }

        // divine shield
        if (divineSheild.state.isActive) {
            divineSheild.consume(event);
            event.set(0);
            return event;
        }
        // poisonous
        const poisonous = source.child.feats.child.poisonous;
        if (poisonous.state.isActive && minion) event.config({ isPoisonous: true });

        this.origin.state.damage += result;
        DebugUtil.log(`${role.name} receive ${result} Damage, total ${this.origin.state.damage}`);
        dispose.active(false, event.detail.source, event.detail.method);
        return event;
    }

    public onHurt(event: DamageEvent) {
        const role = this.route.role;
        if (!role) return;
        if (event.detail.isAbort) return;

        const minion = this.route.minion;
        if (event.detail.options.isPoisonous && minion) {
            const source = event.detail.source;
            const method = event.detail.method;
            minion.child.dispose.active(true, source, method);
        }

        return this.event.onHurt(event);
    }


    public toHeal(event: RestoreEvent) {
        this.event.toHeal(event);
    }

    public doHeal(event: RestoreEvent): RestoreEvent {
        let result = event.detail.result;
        const role = this.route.role;
        if (!role) return event;
        if (result <= 0) {
            event.set(0)
            return event;
        }
        const damage = this.origin.state.damage;
        const restore = Math.min(damage, result);
        const overflow = Math.max(0, result - damage);
        if (restore > 0) DebugUtil.log(`${role.name} restore ${restore} Health`);
        this.origin.state.damage -= restore;
        event.set(restore, overflow);
        return event;
    }

    public onHeal(event: RestoreEvent) {
        const role = this.route.role;
        if (!role) return;
        if (event.detail.isAbort) return;
        if (event.detail.result > 0) this.event.onHeal(event);
        if (event.detail.overflow > 0) {
            const feats = role.child.feats;
            feats.child.overheal.forEach(item => item.run());
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