import { DebugUtil, Event, Loader, Model, TranxUtil } from "set-piece";
import { BoardModel, SelectEvent, SelectUtil, MinionCardModel, RoleModel, PlayerModel, GameModel } from "../../..";

export namespace RoleActionProps {
    export type S = {
        origin: number;
        reduce: number;
        isLock: boolean;
    };
    export type E = {
        toRun: Event;
        onRun: Event;
    };
    export type C = {};
    export type R = {};
    export type P = {
        role: RoleModel;
        board: BoardModel;
        game: GameModel;
        player: PlayerModel;
    };
}

export class RoleActionModel extends Model<
    RoleActionProps.E,
    RoleActionProps.S,
    RoleActionProps.C,
    RoleActionProps.R,
    RoleActionProps.P
> {

    public get state() {
        const state = super.state;
        return {
            ...state,
            isActive: this.check(state),
            current: state.origin - state.reduce,
        }
    }

    constructor(loader?: Loader<RoleActionModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    origin: 1,
                    reduce: 0,
                    isLock: false,
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
                route: {
                    role: RoleModel.prototype,
                    board: BoardModel.prototype,
                    game: GameModel.prototype,
                    player: PlayerModel.prototype,
                }
            }
        });
    }

    @TranxUtil.span()
    public reset() {
        this.draft.state.reduce = 0;
    }

    private async select(): Promise<RoleModel | undefined> {
        const game = this.route.game;
        if (!game) return;

        const role = this.route.role;
        if (!role) return;
        const entries = role.child.entries;
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
            const entries = item.child.entries;
            const taunt = entries.child.taunt;
            const stealth = entries.child.stealth;
            return taunt.state.isActive && !stealth.state.isActive;
        });
        if (tauntOptions.length) options = tauntOptions;

        options = options.filter(item => {
            const entries = item.child.entries;
            const stealth = entries.child.stealth;
            return !stealth.state.isActive;
        })
        const result = await SelectUtil.get(new SelectEvent(options));
        return result;
    }

    @DebugUtil.log()
    public async run() {
        if (!this.state.isActive) return;

        const game = this.route.game;
        if (!game) return;
        
        const roleA = this.route.role;
        if (!roleA) return;
        // select
        const roleB = await this.select();
        if (!roleB) return;

        const event = this.event.toRun(new Event({}))
        if (event.isCancel) return;

        // mana
        if (!this.use()) return;
        // atytack
        const attack = roleA.child.attack;
        await attack.run(roleB);
        
        this.event.onRun(new Event({}));
    }

    private check(state: RoleActionProps.S): boolean {
        if (state.isLock) return false;

        const current = state.origin - state.reduce;
        if (current <= 0) return false;

        const player = this.route.player;
        if (!player) return false;

        const game = this.route.game;
        if (!game) return false;

        const turn = game.child.turn;
        if (turn.refer.current !== player) return false;

        const role = this.route.role;
        if (!role) return false;

        const entries = role.child.entries;
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
        
        if (!attack.state.isActive) return false;
        return true;
    }

    public use() {
        if (!this.state.isActive) return false;
        this.draft.state.reduce ++;
        return true;
    }
}