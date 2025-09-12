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
    export type C = {}
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
        const minion = this.route.minion;
        const weapon: WeaponCardModel | undefined = hero?.child.weapon;
        const damage = hero?.child.damage ?? minion?.child.damage;
        return {
            ...refer,
            weapon,
            damage,
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
                child: { ...props.child },
                refer: { ...props.refer },
            }
        });
    }


    @DebugUtil.log()
    public async run(roleB: RoleModel) {
        const roleA = this.route.role;
        if (!roleA) return;
        if (!this.state.isActive) return;
        
        const signal = this.event.toRun(new Event({ target: roleB }))
        if (signal.isCancel) return;
        
        const healthB = roleB.child.health;
        const attackB = roleB.child.attack;
        if (healthB.state.current <= 0) return;

        const sourceA = roleA.route.card ?? roleA.route.hero;
        const sourceB = roleB.route.card ?? roleB.route.hero;
        if (!sourceA || !sourceB) return;

        // execute
        DamageModel.run([
            new DamageEvent({
                target: roleB,
                detail: this,
                type: DamageType.ATTACK,
                source: sourceA,
                origin: this.state.current,
            }),
            new DamageEvent({
                target: roleA,
                detail: this,
                type: DamageType.DEFEND,
                source: sourceB,
                origin: attackB.state.current,
            }),
        ])
        // weapon
        const weapon = this.refer.weapon;
        if (weapon) weapon.child.action.use();

        // stealth
        const entries = roleA.child.entries;
        const stealth = entries.child.stealth;
        stealth.deactive();

        this.event.onRun(new Event({ target: roleB })); 
    }
}
