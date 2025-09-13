import { Decor, Event, EventUtil, Method, Model, StateChangeEvent, StateUtil } from "set-piece";
import { GameModel, PlayerModel, HeroModel, RoleAttackModel, RoleAttackProps, TurnModel, BoardModel } from "../../..";

export namespace WeaponAttackProps {
    export type E = {}
    export type S = {
        origin: number;
        offset: number;
    }
    export type C = {}
    export type R = {}
}

export class WeaponAttackModel extends Model<
    WeaponAttackProps.E,
    WeaponAttackProps.S,
    WeaponAttackProps.C,
    WeaponAttackProps.R
> {
    public get route() {
        const route = super.route;
        const hero: HeroModel | undefined = route.order.find(item => item instanceof HeroModel);
        return { 
            ...route, 
            hero,
            game: route.order.find(item => item instanceof GameModel),
            player: route.order.find(item => item instanceof PlayerModel),
            board: route.order.find(item => item instanceof BoardModel),
        }
    }

    public get state() {
        const state = super.state;
        return {
            ...state,
            isActive: this.check(),
            current: state.origin + state.offset,
        }
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
            }
        });
    }

    private check() {
        const player = this.route.player;
        if (!player) return false

        const game = this.route.game;
        if (!game) return false;

        const turn = game.child.turn;
        const current = turn.refer.current;
        if (current === player) return true;
        return false;
    }

    @StateUtil.on(self => self.route.player?.proxy.child.hero.all(RoleAttackModel).decor)
    private onCheck(that: RoleAttackModel, decor: Decor<RoleAttackProps.S>) {
        if (!this.state.isActive) return;
        if (!this.route.board) return;
        decor.current.offset += this.state.origin;
    }
}