import { Event, Method, Model, TranxUtil } from "set-piece";
import { HeroModel, DisposeModel, GameModel, PlayerModel, WeaponCardModel, CardModel } from "../../..";

export namespace WeaponActionProps {
    export type E = {
        onUse: void;
    };
    export type S = {
        origin: number;
        offset: number;
        memory: number;
        reduce: number;
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
        const limit = state.origin + state.offset;
        const baseline = Math.max(state.memory, limit);
        return {
            ...state,
            limit,
            current: Math.min(baseline - state.reduce, limit),
        }
    }

    constructor(loader: Method<WeaponActionModel['props'] & {
        state: Pick<WeaponActionProps.S, 'origin'>
    }, []>) {
        super(() => {
            const props = loader?.();
            const memory = props.state.origin + (props.state.offset ?? 0);
            return {
                uuid: props.uuid,
                state: { 
                    offset: 0,
                    reduce: 0,
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
        this.draft.state.reduce += 1;
        const weapon = this.route.weapon;
        if (!weapon) return;
        const dispose = weapon.child.dispose;
        dispose.active();
    }
}