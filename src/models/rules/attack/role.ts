import { DebugUtil, Event, Method, Model, StoreUtil } from "set-piece";
import { DamageEvent, DamageModel, MinionCardModel, RoleModel, GameModel, PlayerModel, HeroModel, WeaponCardModel } from "../../..";
import { DamageType } from "../../../types/damage";

export namespace RoleAttackProps {
    export type E = {
        toRun: Event<{ target: RoleModel }>;
        onRun: Event<{ target: RoleModel }>;
    }
    export type S = {
        origin: number;
        offset: number;
    }
    export type C = {
        damage: DamageModel;
    }
    export type R = {}
}

@StoreUtil.is('attack')
export class RoleAttackModel extends Model<
    RoleAttackProps.E,
    RoleAttackProps.S,
    RoleAttackProps.C,
    RoleAttackProps.R
> {
    public get route() {
        const route = super.route;
        const minion: MinionCardModel | undefined = route.order.find(item => item instanceof MinionCardModel);
        const hero: HeroModel | undefined = route.order.find(item => item instanceof HeroModel);
        return { 
            ...route, 
            minion,
            hero,
            role: route.order.find(item => item instanceof RoleModel),
            game: route.order.find(item => item instanceof GameModel),
            player: route.order.find(item => item instanceof PlayerModel),
        }
    }

    public get refer() {
        const refer = super.refer;
        const hero = this.route.hero;
        const weapon: WeaponCardModel | undefined = hero?.child.weapon;
        return {
            ...refer,
            weapon
        }
    }

    public get state() {
        const state = super.state;
        const current: number = state.origin + state.offset;
        return {
            ...state,
            isActive: current > 0,
            current,
        }
    }
    
    constructor(loader: Method<RoleAttackModel['props'] & {
        state: Pick<RoleAttackProps.S, 'origin'>
    }, []>) {
        super(() => {
            const props = loader?.();
            return {
                uuid: props.uuid,
                state: {
                    offset: 0,
                    ...props.state,
                },
                child: { 
                    damage: props.child?.damage ?? new DamageModel(),
                    ...props.child,
                },
                refer: { ...props.refer },
            }
        });
    }


    @DebugUtil.log()
    public async run(target: RoleModel) {
        const role = this.route.role;
        if (!role) return;
        if (!this.state.isActive) return;
        
        const signal = this.event.toRun(new Event({ target }))
        if (signal.isCancel) return;
        
        const health = target.child.health.state.current;
        if (health <= 0) return;

        // execute
        DamageModel.run([
            new DamageEvent({
                target,
                type: DamageType.ATTACK,
                source: this.child.damage,
                origin: this.state.current,
            }),
            new DamageEvent({
                target: role,
                type: DamageType.DEFEND,
                source: target.child.attack.child.damage,
                origin: target.child.attack.state.current,
            }),
        ])
        // weapon
        const weapon = this.refer.weapon;
        if (weapon) weapon.child.durability.consume();

        // stealth
        const entries = role.child.entries;
        const stealth = entries.child.stealth;
        stealth.deactive();

        this.event.onRun(new Event({ target: target })); 
    }
}
