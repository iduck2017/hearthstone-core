import { Decor, Event, EventUtil, Method, Model, StateChangeEvent, StateUtil } from "set-piece";
import { GameModel, PlayerModel, HeroModel, RoleAttackModel, RoleAttackProps, TurnModel, BoardModel, WeaponCardModel } from "../../..";

export namespace WeaponAttackProps {
    export type E = {}
    export type S = {
        origin: number;
        offset: number;
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
    public get state() {
        const state = super.state;
        return {
            ...state,
            current: state.origin + state.offset,
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

    constructor(loader: Method<WeaponAttackModel['props'] & {
        state: Pick<WeaponAttackProps.S, 'origin'>
    }, []>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: { 
                    offset: 0,
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

    @StateUtil.on(self => self.route.player?.proxy.child.hero.all(RoleAttackModel).decor)
    private onCheck(that: RoleAttackModel, decor: Decor<RoleAttackProps.S>) {
        if (!this.status) return;
        if (!this.route.board) return;
        decor.draft.offset += this.state.origin;
    }
}