import { DebugUtil, Decor, Event, Method, Model, StateUtil, StoreUtil } from "set-piece";
import { DamageEvent, DamageModel, MinionCardModel, RoleModel, GameModel, PlayerModel, HeroModel, WeaponCardModel } from "../../..";
import { DamageType } from "../../../types/damage";

export namespace RoleAttackProps {
    export type E = {
        toRun: Event<{ target: RoleModel }>;
        toRecv: Event<{ source: RoleModel }>;
        onRun: Event<{ target: RoleModel }>;
    }
    export type S = {
        origin: number;
        current: number;
    }
    export type C = {}
    export type R = {}
    export type P = {
        role: RoleModel;
        minion: MinionCardModel;
        hero: HeroModel;
        game: GameModel;
        player: PlayerModel;
    }
}

export class RoleAttackDecor extends Decor<RoleAttackProps.S> {
    public add(value: number) { this.detail.current += value }
}

@StateUtil.use(RoleAttackDecor)
@StoreUtil.is('attack')
export class RoleAttackModel extends Model<
    RoleAttackProps.E,
    RoleAttackProps.S,
    RoleAttackProps.C,
    RoleAttackProps.R,
    RoleAttackProps.P
> {
    public get status() { 
        // is alive
        const minion = this.route.minion;
        const hero = this.route.hero;
        const entity = minion ?? hero;
        if (!entity) return false;
        const dispose = entity.child.dispose;
        if (dispose.status) return false;
        // has attack
        if (this.state.current <= 0) return false;
        return true;
    }

    constructor(loader: Method<RoleAttackModel['props'] & {
        state: Pick<RoleAttackProps.S, 'origin'>
    }, []>) {
        super(() => {
            const props = loader?.();
            return {
                uuid: props.uuid,
                state: { 
                    current: props.state.current ?? props.state.origin,
                    ...props.state 
                },
                child: { ...props.child },
                refer: { ...props.refer },
                route: {
                    role: RoleModel.prototype,
                    minion: MinionCardModel.prototype,
                    hero: HeroModel.prototype,
                    game: GameModel.prototype,
                    player: PlayerModel.prototype,
                }
            }
        });
    }


    @DebugUtil.log()
    public async run(roleB: RoleModel) {
        const roleA = this.route.role;
        if (!roleA) return;
        if (!this.status) return;

        const attackB = roleB.child.attack;
        const eventA = new Event({ source: roleA })
        attackB.event.toRecv(eventA);
        if (eventA.isAbort) return;
        
        const eventB = new Event({ target: roleB })
        this.event.toRun(eventB);
        if (eventB.isAbort) return;

        if (!this.status) return;
        const healthB = roleB.child.health;
        if (healthB.state.current <= 0) return;

        const sourceA = roleA.route.card ?? roleA.route.hero;
        const sourceB = roleB.route.card ?? roleB.route.hero;
        if (!sourceA || !sourceB) return;

        // execute
        DamageModel.run([
            new DamageEvent({
                target: roleB,
                method: this,
                type: DamageType.ATTACK,
                source: sourceA,
                origin: this.state.current,
            }),
            new DamageEvent({
                target: roleA,
                method: this,
                type: DamageType.DEFEND,
                source: sourceB,
                origin: attackB.state.current,
            }),
        ])
        this.onRun(roleB);
    }


    protected onRun(roleB: RoleModel) {
        const roleA = this.route.role;
        if (!roleA) return;

        const hero = this.route.hero;
        if (hero) {
            const player = this.route.player;
            if (!player) return;
            const board = player.child.board;
            const weapon = board.child.weapon;
            if (weapon) weapon.child.action.use();
        }

        // stealth
        const entries = roleA.child.entries;
        const stealth = entries.child.stealth;
        stealth.deactive();

        this.event.onRun(new Event({ target: roleB })); 
    }

}
