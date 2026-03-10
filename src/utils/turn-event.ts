import { Event, Method, Model, useListener } from "set-piece";
import { GameModel } from "../entities/game";

export class TurnStartEvent extends Event {}
export class TurnEndEvent extends Event {
    constructor(props: {
        options: void,
        result: void,
    }) {
        super()
    }
}

export function useTurnEndEventListener<
    I extends Model
>(selector: (self: I) => GameModel | undefined) {
    return function(
        prototype: I,
        key: string,
        descriptor: TypedPropertyDescriptor<(target: GameModel, event: TurnEndEvent) => void>,
    ) {
        const method = descriptor.value;
        if (!method) return;
        descriptor.value = function _handleTurnEnd(this: I, target: unknown, event: TurnEndEvent) {
            const game = selector(this);
            if (game !== target) return;
            if (!(target instanceof GameModel)) return;
            method.call(this, target, event);
        }
        return useListener(() => [TurnEndEvent, GameModel, GameModel])(
            prototype,
            key,
            descriptor
        );
    }
}