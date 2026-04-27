import { Model, PostEvent, PrevEvent, useEventConsumer } from "set-piece";
import { PlayerModel } from "../entities/player";

export class SpellPlayPrevEvent extends PrevEvent<{}> {
    protected _brand: symbol = Symbol('spell-play-prev-event');
}

export class SpellPlayPostEvent extends PostEvent<{}, undefined> {
    protected _brand: symbol = Symbol('spell-play-post-event');
}

// Fires after a spell fully resolves (effects done, card in graveyard).
// Emitted on the SpellModel; subscribes to all cards in the player's hand.
export function useSpellPlayEventConsumer<I extends Model & { player: PlayerModel | undefined }>() {
    return function(
        prototype: I,
        key: string,
        descriptor: TypedPropertyDescriptor<(event: SpellPlayPostEvent) => void>
    ) {
        useEventConsumer((i: I) => [
            i.player?.graveyard.cards,
            SpellPlayPostEvent
        ])(prototype, key, descriptor);
    }
}
