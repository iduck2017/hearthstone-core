import { DebugUtil, Decor, Event, EventUtil, Method, Model, StateUtil, TranxUtil } from "set-piece";
import { RoleModel, MinionCardModel, GameModel, PlayerModel, CardModel, HeroModel, RoleBuffModel } from "../..";
import { DamageEvent } from "../../types/damage";
import { RestoreEvent } from "../../types/restore";
import { OperationType } from "../../types/decor";
import { Operation } from "../../types/decor";

export namespace RoleHealthProps {
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
    export type P = {
        card: CardModel;
        minion: MinionCardModel;
        role: RoleModel;
        game: GameModel;
        hero: HeroModel;
        player: PlayerModel;
    }
}

export class RoleHealthDecor extends Decor<RoleHealthProps.S> {
    private operations: Operation[] = [];

    public get result() {
        const result = { ...this.detail };
        const buffs = this.operations
            .filter(item => item.reason instanceof RoleBuffModel)
            .sort((a, b) => a.reason.uuid.localeCompare(b.reason.uuid));
        buffs.forEach(item => {
            if (item.type === OperationType.ADD) result.maximum += item.value;
            if (item.type === OperationType.SET) result.maximum = item.value;
        })
        const items = this.operations.filter(item => !(item.reason instanceof RoleBuffModel));
        items.forEach(item => {
            if (item.type === OperationType.ADD) result.maximum += item.value;
            if (item.type === OperationType.SET) result.maximum = item.value;
        })
        if (result.maximum <= 0) result.maximum = 0;
        return result;
    }
    
    public add(operation: Operation) { 
        this.operations.push(operation);
    }
}

@StateUtil.use(RoleHealthDecor)
export class RoleHealthModel extends Model<
    RoleHealthProps.E,
    RoleHealthProps.S,
    RoleHealthProps.C,
    RoleHealthProps.R,
    RoleHealthProps.P
> {
    public get state() {
        const state = super.state;
        const baseline = Math.max(state.memory, state.maximum);
        return {
            ...state,
            current: Math.min(baseline - state.damage, state.maximum),
        }
    }

    constructor(loader: Method<RoleHealthModel['props'] & {
        state: Pick<RoleHealthProps.S, 'origin'>
    }, []>) {
        super(() => {
            const props = loader?.();
            const maximum = props.state.maximum ?? props.state.origin;
            const memory = props.state.memory ?? maximum;
            return {
                uuid: props.uuid,
                state: { 
                    damage: 0,
                    memory,
                    maximum,
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
        const entries = role.child.feats;
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
            event.set(0);
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
        this.draft.state.damage -= Math.min(damage, result);
        event.set(Math.min(damage, result), Math.max(0, result - damage));
        return event;
    }

    public onHeal(event: RestoreEvent) {
        const role = this.route.role;
        if (!role) return;
        if (event.isAbort) return;
        if (event.detail.result > 0) this.event.onHeal(event);
        if (event.detail.overflow > 0) {
            const feats = role.child.feats;
            feats.child.overheal.forEach(item => item.run());
        }
    }
    

    @EventUtil.on(self => self.proxy.event.onChange)
    @DebugUtil.log()
    @TranxUtil.span()
    private onChange(that: RoleHealthModel, event: Event) {
        const { memory, maximum, damage } = that.state;
        const offset = memory - maximum;
        if (offset !== 0) this.draft.state.memory = maximum;
        if (offset > 0) this.draft.state.damage -= Math.min(damage, offset);
    }
}