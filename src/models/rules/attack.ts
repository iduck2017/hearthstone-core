import { DebugUtil, Event, Model, StoreUtil } from "set-piece";
import { MinionModel } from "../..";
import { RoleModel } from "../role";
import { GameModel } from "../game";
import { PlayerModel } from "../player";

export namespace AttackProps {
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
    
    constructor(props: AttackModel['props'] & {
        state: Pick<AttackProps.S, 'origin'>
    }) {
        super({
            uuid: props.uuid,
            state: {
                offset: 0,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        })
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
        const attackB = target.child.attack.state.current;
        const signal = this.event.toRun(new Event({ target }))
        if (signal.isCancel) return;
        const healthB = target.child.health.state.current;
        if (healthB <= 0) return;
        // todo
        // DamageUtil.run([
        //     new DamageEvent({
        //         target: roleB,
        //         type: DamageType.ATTACK,
        //         source: cardA.child.cha.child.damage,
        //         reason: this,
        //         origin: this.state.current,
        //     }),
        //     new DamageEvent({
        //         target: roleA,
        //         type: DamageType.DEFEND,
        //         source: cardB.child.actions.child.damage,
        //         reason: this,
        //         origin: attackB,
        //     }),
        // ])
        this.event.onRun(new Event({ target: target })); 
    }

    private doRun() {
        
    }
}
