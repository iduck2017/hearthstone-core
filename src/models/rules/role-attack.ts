import { DebugService, Decor, Event, Method, Model, StatePlugin, ChunkService } from "set-piece";
import { DamageEvent, DamageModel, MinionCardModel, GameModel, PlayerModel, HeroModel, Selector } from "../..";
import { DamageType } from "../../types/events/damage";
import { AbortEvent } from "../../types/events/abort";
import { RoleModel } from "../entities/heroes";
import { RoleAttackDecor } from "../../types/decors/role-attack";

export namespace RoleAttackModel {
    export type E = {
        toRun: AbortEvent<{ target: RoleModel }>;
        onRun: Event<{ target: RoleModel }>;
        toReceive: AbortEvent<{ source: RoleModel }>;
        onReceive: Event<{ source: RoleModel }>;
    }
    export type S = {
        origin: number;
        current: number;
    }
    export type C = {}
    export type R = {}
}



@ChunkService.is('role-attack')
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

    public get state() {
        const result = super.state;
        return {
            ...result,
            isReady: this.isReady,
        }
    }

    protected get isReady() { 
        // is alive
        const minion = this.route.minion;
        const hero = this.route.hero;
        const entity = minion ?? hero;
        if (!entity) return false;
        
        const dispose = entity.child.dispose;
        if (dispose.state.isActived) return false;

        // has attack
        if (super.state.current <= 0) return false;

        // need target
        const selector = this.precheck();
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

    
    public precheck(): Selector<RoleModel> | undefined {
        const game = this.route.game;
        if (!game) return;

        const role = this.route.role;
        if (!role) return;

        const minion = this.route.minion;
        const charge = minion ? minion.child.charge : undefined;
        const sleep = role.child.sleep;

        const player = this.route.player;
        if (!player) return;
        const opponent = player.refer.opponent;
        if (!opponent) return;

        const board = opponent.child.board;
        let options: RoleModel[] = board.refer.minions;

        // include hero
        if (!sleep.state.isActived || charge?.state.isEnabled) {
            options.push(opponent.child.hero);
        }

        // consider taunt
        if (options.find(item => item.child.taunt.state.isActived)) {
            options = options.filter(item => {
                const taunt = item.child.taunt;
                const stealth = item.child.stealth;
                return taunt.state.isEnabled && !stealth.state.isEnabled;
            });
        }

        // exclude stealth
        options = options.filter(item => {
            const stealth = item.child.stealth;
            return !stealth.state.isEnabled;
        })
        return new Selector(options, {});
    }


    @DebugService.span()
    public run(roleB: RoleModel) {
        const roleA = this.route.role;
        if (!roleA) return;
        if (!this.isReady) return;

        const attackB = roleB.child.attack;
        const healthB = roleB.child.health;

        // attack        
        const eventA = new AbortEvent({ target: roleB })
        this.event.toRun(eventA);
        let isValid = eventA.detail.isValid;
        if (!isValid) return;

        // receive
        const eventB = new AbortEvent({ source: roleA });
        attackB.event.toReceive(eventB);
        isValid = eventB.detail.isValid;
        if (!isValid) return;

        if (!this.isReady) return;
        if (healthB.state.current <= 0) return;

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
        
        // after
        const hero = this.route.hero;
        if (hero) {
            const player = this.route.player;
            if (!player) return;
            const hero = player.child.hero;
            const weapon = hero.child.weapon;
            if (weapon) weapon.child.action.consume();
        }
        // stealth
        const stealth = roleA.child.stealth;
        stealth.disable();

        DebugService.log(`${roleA.name} Attack ${roleB.name}`);
        this.event.onRun(new Event({ target: roleB })); 
    }


}
