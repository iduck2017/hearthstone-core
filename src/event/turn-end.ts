import { Model, PostEvent, PrevEvent, useEventConsumer } from "set-piece";
import { GameModel } from "../entities/game";

export class TurnEndPostEvent extends PostEvent<{}, unknown> {
    protected _brand: symbol = Symbol('turn-end-post-event');
}
export class TurnEndPrevEvent extends PrevEvent<{}> {
    protected _brand: symbol = Symbol('turn-end-prev-event');
}


export function useTurnEndPrevEventConsumer<I extends Model & { game: GameModel | undefined }>() {
    return function(
        prototype: I,
        key: string,
        descriptor: TypedPropertyDescriptor<(event: TurnEndPrevEvent, target: GameModel) => void>
    ) {
        useEventConsumer((i: I) => [i.game, TurnEndPrevEvent])(
            prototype,
            key,
            descriptor
        );
    }
}

export function useTurnEndEventConsumer<I extends Model & { game: GameModel | undefined }>() {
    return function(
        prototype: I,
        key: string,
        descriptor: TypedPropertyDescriptor<(event: TurnEndPostEvent, target: GameModel) => void>
    ) {
        useEventConsumer((i: I) => [i.game, TurnEndPostEvent])(
            prototype,
            key,
            descriptor
        );
    }
}