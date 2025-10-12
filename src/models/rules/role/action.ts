import { DebugUtil, Decor, Event, Model, StateUtil, TranxUtil } from "set-piece";
import { BoardModel, SelectEvent, SelectUtil, MinionCardModel, RoleModel, PlayerModel, GameModel, CardModel, HeroModel } from "../../..";
import { AbortEvent } from "../../../types/abort-event";

export namespace RoleActionModel {
    export type S = {
        origin: number;
        comsume: number;
        isLock: boolean;
    };
    export type E = {
        toRun: AbortEvent;
        onRun: Event;
    };
    export type C = {};
    export type R = {};
    export type P = {
        role: RoleModel;
        game: GameModel;
        player: PlayerModel;

        card: CardModel;
        hero: HeroModel;
    };
}

export class RoleActionDecor extends Decor<RoleActionModel.S> {
    public add(value: number) { 
        this._origin.origin += value 
    }
    
    public lock() { 
        this._origin.isLock = true 
    }
}

export class RoleActionModel extends Model<
    RoleActionModel.E,
    RoleActionModel.S,
    RoleActionModel.C,
    RoleActionModel.R
> {
    public get route() {
        const result = super.route;
        return {
            ...result,
            role: result.list.find(item => item instanceof RoleModel),
            game: result.list.find(item => item instanceof GameModel),
            player: result.list.find(item => item instanceof PlayerModel),
            card: result.list.find(item => item instanceof CardModel),
            hero: result.list.find(item => item instanceof HeroModel),
        }
    }

    public get decor(): RoleActionDecor {
        return new RoleActionDecor(this);
    }

    public get state() {
        const state = super.state;
        return {
            ...state,
            current: state.origin - state.comsume,
        }
    }

    public get status(): boolean {
        if (this.state.isLock) return false;
        const current = this.state.current;
        if (current <= 0) return false;

        const card = this.route.card;
        if (card && !card.route.board) return false;

        const game = this.route.game;
        if (!game) return false;
        const turn = game.child.turn;
        const player = this.route.player;
        if (turn.refer.current !== player) return false;
        const role = this.route.role;
        if (!role) return false;

        const entries = role.child.feats;
        const rush = entries.child.rush;
        const sleep = role.child.sleep;
        const attack = role.child.attack;
        const frozen = entries.child.frozen;
        const charge = entries.child.charge;

        if (frozen.state.isActive) return false;
        if (
            sleep.state.isActive &&
            !charge.state.isActive &&
            !rush.state.isActive
        ) return false;
        
        if (!attack.status) return false;
        return true;
    }

    constructor(props?: RoleActionModel['props']) {
        super({
            uuid: props?.uuid,
            state: {
                origin: 1,
                comsume: 0,
                isLock: false,
                ...props?.state,
            },
            child: { ...props?.child },
            refer: { ...props?.refer },
        });
    }

    @TranxUtil.span()
    public reset() {
        this.origin.state.comsume = 0;
    }

    private async select(): Promise<RoleModel | undefined> {
        const game = this.route.game;
        if (!game) return;

        const role = this.route.role;
        if (!role) return;
        const entries = role.child.feats;
        const charge = entries.child.charge;
        const sleep = role.child.sleep;

        const player = this.route.player;
        if (!player) return;
        
        const opponent = player.refer.opponent;
        if (!opponent) return;

        const board = opponent.child.board;
        let options: RoleModel[] = board.child.minions.map(item => item.child.role);
        if (!sleep.state.isActive || charge.state.isActive) {
            options.push(opponent.child.hero.child.role);
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
        const result = await SelectUtil.get(new SelectEvent(options, {
            code: (target) => `attack-${target.uuid}`,
            desc: (target) => `Attack ${target.name}`,
        }));
        return result;
    }

    @DebugUtil.log()
    public async run() {
        if (!this.status) return;

        const game = this.route.game;
        if (!game) return;
        
        const roleA = this.route.role;
        if (!roleA) return;
        // select
        const roleB = await this.select();
        if (!roleB) return;

        const event = new AbortEvent({})
        this.event.toRun(event)
        if (event.detail.isAbort) return;

        // mana
        if (!this.consume()) return;
        // atytack
        const attack = roleA.child.attack;
        await attack.run(roleB);
        
        this.event.onRun(new Event({}));
    }

    public consume() {
        if (!this.status) return false;
        this.origin.state.comsume ++;
        return true;
    }
}