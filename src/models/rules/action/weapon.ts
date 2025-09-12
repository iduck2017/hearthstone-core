import { Event, Method, Model, TranxUtil } from "set-piece";
import { HeroModel, DisposeModel, GameModel, PlayerModel, WeaponCardModel, CardModel } from "../../..";
import { DisposeEvent } from "../dispose";

export namespace WeaponActionProps {
    export type E = {
        onUse: Event;
    };
    export type S = {
        origin: number;
        offset: number;
        memory: number;
        reduce: number;
    };
    export type C = {};
    export type R = {};
}

export class WeaponActionModel extends Model<
    WeaponActionProps.E,
    WeaponActionProps.S,
    WeaponActionProps.C,
    WeaponActionProps.R
> {
    public get route() {
        const route = super.route;
        const weapon: WeaponCardModel | undefined = route.order.find(item => item instanceof WeaponCardModel);
        const hero: HeroModel | undefined = route.order.find(item => item instanceof HeroModel);
        return { 
            ...route, 
            weapon,
            hero,
            game: route.order.find(item => item instanceof GameModel),
            player: route.order.find(item => item instanceof PlayerModel),
        }
    }

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
            }
        });
    }

    @DisposeModel.span()
    @TranxUtil.span()
    public use(event?: DisposeEvent) {
        this.draft.state.reduce += 1;
        const weapon = this.route.weapon;
        if (!weapon) return;
        if (!event) event = {
            detail: this,
            source: weapon,
        }
        const dispose = weapon.child.dispose;
        dispose.active(event);
    }
}