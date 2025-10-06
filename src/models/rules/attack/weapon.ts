import { Decor, Event, EventUtil, Method, Model, StateUtil } from "set-piece";
import { GameModel, PlayerModel, HeroModel, RoleAttackModel, RoleAttackProps, TurnModel, BoardModel, WeaponCardModel, DamageEvent } from "../../..";
import { RoleAttackDecor } from "./role";
import { RoleActionDecor } from "../action/role";
import { OperationType } from "../../../types/decor";

export namespace WeaponAttackProps {
    export type E = {}
    export type S = {
        origin: number;
        current: number;
    }
    export type C = {}
    export type R = {}
    export type P = {
        weapon: WeaponCardModel;
        hero: HeroModel;
        game: GameModel;
        player: PlayerModel;
        board: BoardModel;
    }
}

export class WeaponAttackModel extends Model<
    WeaponAttackProps.E,
    WeaponAttackProps.S,
    WeaponAttackProps.C,
    WeaponAttackProps.R,
    WeaponAttackProps.P
> {
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

    constructor(loader: Method<WeaponAttackModel['props'] & {
        state: Pick<WeaponAttackProps.S, 'origin'>
    }, []>) {
        super(() => {
            const props = loader?.() ?? {};
            const current = props.state.current ?? props.state.origin;
            return {
                uuid: props.uuid,
                state: { 
                    current,
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
                route: {
                    weapon: WeaponCardModel.prototype,
                    hero: HeroModel.prototype,
                    game: GameModel.prototype,
                    player: PlayerModel.prototype,
                    board: BoardModel.prototype,
                }
            }
        });
    }


    @EventUtil.on(self => self.route.game?.proxy.child.turn.event.onStart)
    @EventUtil.on(self => self.route.game?.proxy.child.turn.event.onEnd)
    private onNext(that: TurnModel, event: Event) {
        this.reload()
    }

    @StateUtil.on(self => self.route.player?.proxy.child.hero.child.role.child.attack.decor)
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