import { Event, Method, Model, TranxUtil } from "set-piece";
import { HeroModel, DisposeModel, GameModel, PlayerModel, WeaponCardModel, CardModel } from "../../..";

export namespace WeaponActionProps {
    export type E = {
        onUse: Event;
    };
    export type S = {
        maximum: number;
        origin: number;
        consume: number;
        memory: number;
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
        const baseline = Math.max(state.memory, state.maximum);
        return {
            ...state,
            current: Math.min(baseline - state.consume, state.maximum),
        }
    }

    constructor(loader: Method<WeaponActionModel['props'] & {
        state: Pick<WeaponActionProps.S, 'origin'>
    }, []>) {
        super(() => {
            const props = loader?.();
            const maximum = props.state.maximum ?? props.state.origin;
            const memory = props.state.maximum ?? props.state.origin;
            return {
                uuid: props.uuid,
                state: { 
                    consume: 0,
                    maximum,
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