import { Decor, Event, Model, TranxUtil } from "set-piece";
import { PlayerModel, GameModel, CardModel, HeroModel, MinionCardModel } from "../../..";
import { AbortEvent } from "../../../types/events/abort";
import { RoleActionDecor } from "../../../types/decors/role-action";

export namespace RoleActionModel {
    export type S = {
        origin: number;
        comsume: number;
        actived: boolean;
    };
    export type E = {
        toRun: AbortEvent;
        onRun: Event;
    };
    export type C = {};
    export type R = {};
}


export class RoleActionModel extends Model<
    RoleActionModel.E,
    RoleActionModel.S,
    RoleActionModel.C,
    RoleActionModel.R
> {
    public get chunk() {
        return {
            current: this.state.current > 1 ? this.state.current : undefined,
            actived: this.status,
        }
    }

    public get route() {
        const result = super.route;
        const hero: HeroModel | undefined = result.items.find(item => item instanceof HeroModel);
        const minion: MinionCardModel | undefined = result.items.find(item => item instanceof MinionCardModel);
        return {
            ...result,
            game: result.items.find(item => item instanceof GameModel),
            player: result.items.find(item => item instanceof PlayerModel),
            card: result.items.find(item => item instanceof CardModel),
            role: hero ?? minion,
            hero,
            minion
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
        if (!this.state.actived) return false;
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

        const minion = this.route.minion;
        const rush = minion ? minion.child.rush : undefined;
        const charge = minion ? minion.child.charge : undefined;

        const sleep = role.child.sleep;
        const attack = role.child.attack;
        const frozen = role.child.frozen;

        if (frozen.state.actived) return false;
        if (
            sleep.state.actived &&
            !charge?.state.actived &&
            !rush?.state.actived
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
                actived: true,
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

    
    public async start() {
        if (!this.status) return;

        const game = this.route.game;
        if (!game) return;

        const player = this.route.player;
        if (!player) return;
        
        // select
        const roleA = this.route.role;
        if (!roleA) return;
        const attack = roleA.child.attack;
        const selector = attack.selector;
        if (!selector) return;
        const roleB = await player.child.controller.get(selector);
        if (!roleB) return;

        const event = new AbortEvent({})
        this.event.toRun(event)
        if (event.detail.aborted) return;

        // mana
        if (!this.consume()) return;
        // attack
        attack.start(roleB);
        this.event.onRun(new Event({}));
    }

    public consume() {
        if (!this.status) return false;
        this.origin.state.comsume ++;
        return true;
    }
}