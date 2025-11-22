import { Decor, Event, EventUtil, Method, Model, StateUtil } from "set-piece";
import { GameModel, PlayerModel, HeroModel, RoleAttackModel, TurnModel, BoardModel, WeaponCardModel, DamageEvent, RoleAttackDecor } from "../..";
import { OperatorType } from "../../types/operator";

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
    public get chunk() {
        return {
            current: this.state.current,
            origin: this.state.origin,
        }
    }

    public get route() {
        const result = super.route;
        return {
            ...result,
            weapon: result.items.find(item => item instanceof WeaponCardModel),
            player: result.items.find(item => item instanceof PlayerModel),
            game: result.items.find(item => item instanceof GameModel),
            board: result.items.find(item => item instanceof BoardModel),
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


    // @todo use function call
    @EventUtil.on(self => self.handlTurn)
    public listenTurnStart() {
        return this.route.game?.proxy.child.turn.event?.onStart;
    }
    @EventUtil.on(self => self.handlTurn)
    private listenTurnEnd() {
        return this.route.game?.proxy.child.turn.event?.onEnd;
    }
    private handlTurn(that: TurnModel, event: Event) {
        this.reload()
    }
    

    @StateUtil.on(self => self.modifyAttack)
    private listenAttack() {
        return this.route.player?.proxy.child.hero.child.attack.decor;
    }
    private modifyAttack(that: RoleAttackModel, decor: RoleAttackDecor) {
        if (!this.status) return;
        if (!this.route.board) return;
        decor.add({
            type: OperatorType.ADD,
            offset: this.state.current,
            reason: this,
        });
    }
}