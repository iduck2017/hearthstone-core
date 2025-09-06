import { DebugUtil, Event, Loader, Method, Model, TranxUtil } from "set-piece";
import { MinionModel } from "../cards/minion";
import { RoleModel } from "../role";
import { GameModel } from "../game";
import { PlayerModel } from "../player";
import { BoardModel, RushStatus, SelectEvent, SelectUtil } from "../..";
import { FeatureStatus } from "../features";

export namespace ActionProps {
    export type S = {
        origin: number;
        cost: number;
        status: FeatureStatus;
    };
    export type E = {
        toRun: Event;
        onRun: Event;
    };
    export type C = {};
    export type R = {};
}

export class ActionModel extends Model<
    ActionProps.E,
    ActionProps.S,
    ActionProps.C,
    ActionProps.R
> {
    public get route() {
        const route = super.route;
        const minion: MinionModel | undefined = route.order.find(item => item instanceof MinionModel);
        return { 
            ...route, 
            minion,
            role: route.order.find(item => item instanceof RoleModel),
            board: route.order.find(item => item instanceof BoardModel),
            game: route.order.find(item => item instanceof GameModel),
            player: route.order.find(item => item instanceof PlayerModel),
        }
    }

    public get state() {
        const state = super.state;
        return {
            ...state,
            current: state.origin - state.cost,
        }
    }

    constructor(loader?: Loader<ActionModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    origin: 1,
                    cost: 0,
                    status: FeatureStatus.ACTIVE,
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
            }
        });
    }

    @TranxUtil.span()
    public reset() {
        this.draft.state.cost = 0;
    }

    private async select(): Promise<RoleModel | undefined> {
        const game = this.route.game;
        const role = this.route.role;
        const player = this.route.player;
        if (!role) return;
        const action = role.child.action;
        const entries = role.child.entries;
        const rush = entries.child.rush;
        const charge = entries.child.charge;
        if (!game) return;
        if (!action) return;
        if (!player) return;
        const opponent = player.refer.opponent;
        if (!opponent) return;
        const board = opponent.child.board;
        let options: RoleModel[] = board.child.minions.map(item => item.child.role);
        if (rush.state.status !== RushStatus.ACTIVE || charge.state.status) {
            options.push(opponent.child.character.child.role);
        }
        const tauntOptions = options.filter(item => {
            const entries = item.child.entries;
            const taunt = entries.child.taunt;
            const stealth = entries.child.stealth;
            return taunt.state.status && !stealth.state.status;
        });
        if (tauntOptions.length) options = tauntOptions;
        options = options.filter(item => {
            const entries = item.child.entries;
            const stealth = entries.child.stealth;
            return !stealth.state.status;
        })
        const result = await SelectUtil.get(new SelectEvent(options));
        return result;
    }

    @DebugUtil.log()
    public async run() {
        const game = this.route.game;
        const roleA = this.route.role;
        const player = this.route.player;
        const action = roleA?.child.action;
        if (!game) return;
        if (!action) return;
        if (!player) return;
        if (!action.check()) return;
        const roleB = await this.select();
        if (!roleB) return;
        const event = this.event.toRun(new Event({}))
        if (event.isCancel) return;
        if (!action.consume()) return;
        const attack = roleA.child.attack;
        await attack.run(roleB);
        this.event.onRun(new Event({}));
    }

    public check(): boolean {
        const role = this.route.role;
        const game = this.route.game;
        const board = this.route.board;
        const player = this.route.player;
        if (!game) return false;
        if (!role) return false;
        if (!board) return false;
        if (!player) return false;
        const turn = game.child.turn;
        if (turn.refer.current !== player) return false;
        const sleep = role.child.sleep;
        const attack = role.child.attack;
        const entries = role.child.entries;
        const frozen = entries.child.frozen;
        if (frozen.state.status) return false;
        if (sleep.state.status) return false;
        if (!this.state.status) return false;
        if (this.state.current <= 0) return false;
        if (!attack.check()) return false;
        return true;
    }

    public consume() {
        if (!this.check()) return false;
        this.draft.state.cost ++;
        return true;
    }
}