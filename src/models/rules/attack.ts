import { DebugUtil, Event, Method, Model, StoreUtil } from "set-piece";
import { DamageEvent, DamageModel, MinionModel } from "../..";
import { RoleModel } from "../role";
import { GameModel } from "../game";
import { PlayerModel } from "../player";
import { DamageType } from "../../types/damage";

export namespace AttackProps {
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
export class AttackModel extends Model<
    AttackProps.E,
    AttackProps.S,
    AttackProps.C,
    AttackProps.R
> {
    public get route() {
        const route = super.route;
        const minion: MinionModel | undefined = route.order.find(item => item instanceof MinionModel);
        return { 
            ...route, 
            minion,
            role: route.order.find(item => item instanceof RoleModel),
            game: route.order.find(item => item instanceof GameModel),
            player: route.order.find(item => item instanceof PlayerModel),
        }
    }

    public get state() {
        const state = super.state;
        return {
            ...state,
            current: state.origin + state.offset,
        }
    }
    
    constructor(loader: Method<AttackModel['props'] & {
        state: Pick<AttackProps.S, 'origin'>
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

    public check(): boolean {
        if (!this.state.current) return false;
        return true;
    }

    @DebugUtil.log()
    public async run(target: RoleModel) {
        const self = this.route.role;
        if (!self) return;
        if (!this.check()) return;
        
        const signal = this.event.toRun(new Event({ target }))
        if (signal.isCancel) return;
        
        const health = target.child.health.state.current;
        if (health <= 0) return;
        
        DamageModel.run([
            new DamageEvent({
                target,
                type: DamageType.ATTACK,
                source: this.child.damage,
                origin: this.state.current,
            }),
            new DamageEvent({
                target: self,
                type: DamageType.DEFEND,
                source: target.child.attack.child.damage,
                origin: target.child.attack.state.current,
            }),
        ])
        this.event.onRun(new Event({ target: target })); 
    }
}
