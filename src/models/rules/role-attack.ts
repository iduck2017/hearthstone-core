import { DebugUtil, Decor, Event, Method, Model, StateUtil, TemplUtil } from "set-piece";
import { DamageEvent, DamageModel, MinionCardModel, RoleModel, GameModel, PlayerModel, HeroModel, WeaponCardModel, IRoleBuffModel } from "../..";
import { DamageType } from "../../types/damage";
import { Operation, OperationType } from "../../types/decor";
import { AbortEvent } from "../../types/event";

export namespace RoleAttackModel {
    export type E = {
        toRun: AbortEvent<{ target: RoleModel }>;
        toRecv: AbortEvent<{ source: RoleModel }>;
        onRun: Event<{ target: RoleModel }>;
    }
    export type S = {
        origin: number;
        current: number;
    }
    export type C = {}
    export type R = {}
}


export class RoleAttackDecor extends Decor<RoleAttackModel.S> {
    private operations: Operation[] = [];

    public get result() {
        const result = { ...this._detail };
        // buff
        const buffs = this.operations
            .filter(item => item.reason instanceof IRoleBuffModel)
            .sort((a, b) => a.reason.uuid.localeCompare(b.reason.uuid));
        buffs.forEach(item => {
            if (item.type === OperationType.ADD) result.current += item.value;
            if (item.type === OperationType.SET) result.current = item.value;
        })
        const items = this.operations.filter(item => !(item.reason instanceof IRoleBuffModel));
        items.forEach(item => {
            if (item.type === OperationType.ADD) result.current += item.value;
            if (item.type === OperationType.SET) result.current = item.value;
        })
        if (result.current <= 0) result.current = 0;
        return result;
    }
    
    public add(operation: Operation) { 
        this.operations.push(operation);
    }
}

@TemplUtil.is('role-attack')
export class RoleAttackModel extends Model<
    RoleAttackModel.E,
    RoleAttackModel.S,
    RoleAttackModel.C,
    RoleAttackModel.R
> {
    public get route() {
        const result = super.route;
        return {
            ...result,
            role: result.list.find(item => item instanceof RoleModel),
            minion: result.list.find(item => item instanceof MinionCardModel),
            hero: result.list.find(item => item instanceof HeroModel),
            game: result.list.find(item => item instanceof GameModel),
            player: result.list.find(item => item instanceof PlayerModel),
        }
    }

    public get decor(): RoleAttackDecor {
        return new RoleAttackDecor(this);
    }

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

    constructor(props: RoleAttackModel['props']) {
        super({
            uuid: props.uuid,
            state: { 
                origin: 0,
                current: props.state?.current ?? props.state?.origin ?? 0,
                ...props.state 
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }


    @DebugUtil.log()
    public async run(roleB: RoleModel) {
        const roleA = this.route.role;
        if (!roleA) return;
        if (!this.status) return;

        const attackB = roleB.child.attack;
        const eventA = new AbortEvent({ source: roleA })
        attackB.event.toRecv(eventA);
        if (eventA.detail.isAbort) return;
        
        const eventB = new AbortEvent({ target: roleB })
        this.event.toRun(eventB);
        if (eventB.detail.isAbort) return;

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
        const entries = roleA.child.feats;
        const stealth = entries.child.stealth;
        stealth.deactive();

        this.event.onRun(new Event({ target: roleB })); 
    }

}
