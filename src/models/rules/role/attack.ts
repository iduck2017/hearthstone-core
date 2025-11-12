import { DebugUtil, Decor, Event, Method, Model, StateUtil, TemplUtil } from "set-piece";
import { DamageEvent, DamageModel, MinionCardModel, GameModel, PlayerModel, HeroModel, WeaponCardModel, IRoleBuffModel, Selector } from "../../..";
import { DamageType } from "../../../types/damage-event";
import { Operator, OperatorType } from "../../../types/operator";
import { AbortEvent } from "../../../types/abort-event";
import { RoleModel } from "../../features/group/hero";

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
    private operations: Operator[] = [];

    public get result() {
        const result = { ...this._origin };
        // buff
        const buffs = this.operations
            .filter(item => item.reason instanceof IRoleBuffModel)
            .sort((a, b) => a.reason.uuid.localeCompare(b.reason.uuid));
        buffs.forEach(item => {
            if (item.type === OperatorType.ADD) result.current += item.offset;
            if (item.type === OperatorType.SET) result.current = item.offset;
        })
        const items = this.operations.filter(item => !(item.reason instanceof IRoleBuffModel));
        items.forEach(item => {
            if (item.type === OperatorType.ADD) result.current += item.offset;
            if (item.type === OperatorType.SET) result.current = item.offset;
        })
        if (result.current <= 0) result.current = 0;
        return result;
    }
    
    public add(operation: Operator) { 
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
        const hero: HeroModel | undefined = result.items.find(item => item instanceof HeroModel);
        const minion: MinionCardModel | undefined = result.items.find(item => item instanceof MinionCardModel);
        return {
            ...result,
            role: hero ?? minion,
            game: result.items.find(item => item instanceof GameModel),
            player: result.items.find(item => item instanceof PlayerModel),
            hero,
            minion,
        }
    }

    public get chunk() {
        return {
            current: this.state.current,
            origin: this.state.origin,
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
        // need target
        const selector = this.selector;
        if (!selector?.options.length) return false;
        return true;
    }

    constructor(props?: RoleAttackModel['props']) {
        props = props ?? {};
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

    public get selector(): Selector<RoleModel> | undefined {
        const game = this.route.game;
        if (!game) return;

        const role = this.route.role;
        const minion = this.route.minion;
        if (!role) return;

        const charge = minion ? minion.child.feats.child.charge : undefined;
        const sleep = role.child.sleep;

        const player = this.route.player;
        if (!player) return;
        
        const opponent = player.refer.opponent;
        if (!opponent) return;

        const board = opponent.child.board;
        let options: RoleModel[] = board.refer.minions;
        if (!sleep.state.isActive || charge?.state.isActive) {
            options.push(opponent.child.hero);
        }

        const tauntOptions = options.filter(item => {
            const entries = item.child.feats;
            const taunt = entries.child.taunt;
            const stealth = entries.child.stealth;
            return taunt.state.isActive && !stealth.state.isActive;
        });
        if (tauntOptions.length) options = tauntOptions;

        options = options.filter(item => {
            const entries = item.child.feats;
            const stealth = entries.child.stealth;
            return !stealth.state.isActive;
        })
        return new Selector(options, {});
    }


    @DebugUtil.span()
    public run(roleB: RoleModel) {
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


        DebugUtil.log(`${roleA.name} Attack ${roleB.name}`);
        // execute
        DamageModel.deal([
            new DamageEvent({
                target: roleB,
                method: this,
                type: DamageType.ATTACK,
                source: roleA,
                origin: this.state.current,
            }),
            new DamageEvent({
                target: roleA,
                method: this,
                type: DamageType.DEFEND,
                source: roleB,
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
            if (weapon) weapon.child.action.consume();
        }

        // stealth
        const entries = roleA.child.feats;
        const stealth = entries.child.stealth;
        stealth.deactive();

        this.event.onRun(new Event({ target: roleB })); 
    }

}
