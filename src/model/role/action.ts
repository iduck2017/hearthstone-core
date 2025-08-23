import { DebugUtil, Model, TranxUtil } from "set-piece";
import { CardModel } from "../card";
import { RoleModel } from ".";
import { GameModel } from "../game";
import { PlayerModel } from "../player";
import { AbortEvent, BoardModel, RushStatus, SelectEvent, SelectUtil } from "../..";

export namespace ActionModel {
    export type State = {
        readonly origin: number;
        cost: number;
        status: boolean;
    };
    export type Event = {
        toRun: AbortEvent;
        onRun: {};
    };
    export type Child = {};
    export type Refer = {};
}

export class ActionModel extends Model<
    ActionModel.Event,
    ActionModel.State,
    ActionModel.Child,
    ActionModel.Refer
> {
    public get route() {
        const route = super.route;
        const role: RoleModel | undefined = route.path.find(item => item instanceof RoleModel);
        const card: CardModel | undefined = route.path.find(item => item instanceof CardModel);
        return { 
            ...route, 
            role, 
            card,
            board: route.path.find(item => item instanceof BoardModel),
            game: route.path.find(item => item instanceof GameModel),
            player: route.path.find(item => item instanceof PlayerModel),
        }
    }

    public get state() {
        const state = super.state;
        return {
            ...state,
            current: state.origin - state.cost,
        }
    }

    constructor(props: ActionModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                origin: 1,
                cost: 0,
                status: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
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
        let options: RoleModel[] = opponent.refer.roles
        if (rush.state.status === RushStatus.ACTIVE && !charge.state.status) {
            options = opponent.refer.minions;
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
        const event = this.event.toRun(new AbortEvent())
        if (event.isAbort) return;
        if (!action.consume()) return;
        const attack = roleA.child.attack;
        await attack.run(roleB);
        this.event.onRun({});
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