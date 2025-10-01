import { DebugUtil, Decor, Event, Method, Model, StateUtil, StoreUtil } from "set-piece";
import { DamageEvent, DamageModel, MinionCardModel, RoleModel, GameModel, PlayerModel, HeroModel, WeaponCardModel } from "../../..";
import { DamageType } from "../../../types/damage";

export namespace RoleAttackProps {
    export type E = {
        toRun: Event<{ target: RoleModel }>;
        toRecv: Event<{ target: RoleModel }>;
        onRun: Event<{ target: RoleModel }>;
    }
    export type S = {
        origin: number;
        offset: number;
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
    public add(value: number) { this.detail.offset += value }
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
    public get state() {
        const state = super.state;
        const current: number = state.origin + state.offset;
        return {
            ...state,
            current,
        }
    }

    public get status() { return this.state.current > 0; }

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
        let signal = new Event({ target: roleB })
        attackB.event.toRecv(signal);
        if (signal.isAbort) return;
        
        signal = new Event({ target: roleB })
        this.event.toRun(signal);
        if (signal.isAbort) return;
        
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
