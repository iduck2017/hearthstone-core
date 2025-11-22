import { Event, Method, Model, TemplUtil, TranxUtil } from "set-piece";
import { DisposeModel, GameModel, PlayerModel, WeaponCardModel, CardModel } from "../..";

export namespace WeaponActionModel {
    export type E = {
        onConsume: Event;
    };
    export type S = {
        maximum: number;
        origin: number;
        consume: number;
        memory: number;
    };
    export type C = {};
    export type R = {};
}

@TemplUtil.is('weapon-action')
export class WeaponActionModel extends Model<
    WeaponActionModel.E,
    WeaponActionModel.S,
    WeaponActionModel.C,
    WeaponActionModel.R
> {
    public get chunk() {
        return {
            current: this.state.current,
            origin: this.state.origin,
            maximum: this.state.maximum,
        }
    }

    public get route() {
        const result = super.route;
        const weapon: WeaponCardModel | undefined = result.items.find(item => item instanceof WeaponCardModel);
        const game: GameModel | undefined = result.items.find(item => item instanceof GameModel);
        const player: PlayerModel | undefined = result.items.find(item => item instanceof PlayerModel);
        return {
            ...result,
            weapon,
        }
    }

    public get state() {
        const state = super.state;
        const baseline = Math.max(state.memory, state.maximum);
        return {
            ...state,
            current: Math.min(baseline - state.consume, state.maximum),
        }
    }

    constructor(props?: WeaponActionModel['props']) {
        props = props ?? {}
        const state = props.state ?? {};
        const maximum = state.origin ?? 0;
        const memory = state.origin ?? 0;
        super({
            uuid: props.uuid,
            state: { 
                origin: 0,
                consume: 0,
                maximum,
                memory,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @DisposeModel.span()
    @TranxUtil.span()
    public consume() {
        this.origin.state.consume += 1;
        const weapon = this.route.weapon;
        if (!weapon) return;
        const dispose = weapon.child.dispose;
        dispose.check();
    }
}