import { Event, Method, Model, TranxUtil } from "set-piece";
import { HeroModel, DisposeModel, GameModel, PlayerModel, WeaponCardModel, CardModel } from "../../..";

export namespace WeaponActionProps {
    export type E = {
        onUse: Event;
    };
    export type S = {
        origin: number;
        memory: number;
        consume: number;
    };
    export type C = {};
    export type R = {};
    export type P = {
        weapon: WeaponCardModel;
        game: GameModel;
        player: PlayerModel;
    };
}

export class WeaponActionModel extends Model<
    WeaponActionProps.E,
    WeaponActionProps.S,
    WeaponActionProps.C,
    WeaponActionProps.R,
    WeaponActionProps.P
> {
    public get state() {
        const state = super.state;
        const baseline = Math.max(state.memory, state.origin);
        return {
            ...state,
            current: Math.min(baseline - state.consume, state.origin),
        }
    }

    constructor(loader: Method<WeaponActionModel['props'] & {
        state: Pick<WeaponActionProps.S, 'origin'>
    }, []>) {
        super(() => {
            const props = loader?.();
            const memory = props.state.origin;
            return {
                uuid: props.uuid,
                state: { 
                    consume: 0,
                    memory,
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
                route: {
                    weapon: WeaponCardModel.prototype,
                    game: GameModel.prototype,
                    player: PlayerModel.prototype,
                }
            }
        });
    }

    @DisposeModel.span()
    @TranxUtil.span()
    public use() {
        this.draft.state.consume += 1;
        const weapon = this.route.weapon;
        if (!weapon) return;
        const dispose = weapon.child.dispose;
        dispose.active();
    }
}