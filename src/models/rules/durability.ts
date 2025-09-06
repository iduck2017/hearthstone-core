import { Event, Method, Model } from "set-piece";
import { CharacterModel, GameModel, PlayerModel } from "../..";

export namespace DurabilityProps {
    export type E = {
        onConsume: Event;
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

export class DurabilityModel extends Model<
    DurabilityProps.E,
    DurabilityProps.S,
    DurabilityProps.C,
    DurabilityProps.R
> {
    public get route() {
        const route = super.route;
        const character: CharacterModel | undefined = route.order.find(item => item instanceof CharacterModel);
        return { 
            ...route, 
            character,
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

    constructor(loader: Method<DurabilityModel['props'] & {
        state: Pick<DurabilityProps.S, 'origin'>
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

    public consume() {
        this.draft.state.reduce += 1;
        // death
    }


}