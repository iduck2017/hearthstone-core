import { Decor, Event, EventUtil, Method, Model, StateUtil } from "set-piece";
import { GameModel, PlayerModel, HeroModel, RoleAttackModel, TurnModel, BoardModel, WeaponCardModel, DamageEvent } from "../..";
import { RoleAttackDecor } from "./role-attack";
import { RoleActionDecor } from "./role-action";
import { OperationType } from "../../types/decor";

export namespace WeaponAttackModel {
    export type E = {}
    export type S = {
        origin: number;
        current: number;
    }
    export type C = {}
    export type R = {}
}

export class WeaponAttackModel extends Model<
    WeaponAttackModel.E,
    WeaponAttackModel.S,
    WeaponAttackModel.C,
    WeaponAttackModel.R
> {
    public get route() {
        const result = super.route;
        return {
            ...result,
            weapon: result.list.find(item => item instanceof WeaponCardModel),
            player: result.list.find(item => item instanceof PlayerModel),
            game: result.list.find(item => item instanceof GameModel),
            board: result.list.find(item => item instanceof BoardModel),
        }
    }

    public get status() {
        const player = this.route.player;
        if (!player) return false
        const game = this.route.game;
        if (!game) return false;
        const turn = game.child.turn;
        const current = turn.refer.current;
        if (current === player) return true;
        return false;
    }

    constructor(props: WeaponAttackModel['props'] & {
        state: Pick<WeaponAttackModel.S, 'origin'>
    }) {
        const current = props.state.current ?? props.state.origin;
        super({
            uuid: props.uuid,
            state: { 
                current,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }


    @EventUtil.on(self => self.handle)
    public listenStart() {
        return this.route.game?.proxy.child.turn.event?.onStart;
    }

    @EventUtil.on(self => self.handle)
    public listenEnd() {
        return this.route.game?.proxy.child.turn.event?.onEnd;
    }

    private handle(that: TurnModel, event: Event) {
        this.reload()
    }
    

    @StateUtil.on(self => self.onCompute)
    private listenDecor() {
        return this.route.player?.proxy.child.hero.child.role.child.attack.decor;
    }

    private onCompute(that: RoleAttackModel, decor: RoleAttackDecor) {
        if (!this.status) return;
        if (!this.route.board) return;
        decor.add({
            type: OperationType.ADD,
            value: this.state.current,
            reason: this,
        });
    }
}