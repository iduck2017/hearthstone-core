import { Model, PostEvent, PrevEvent, useEventConsumer } from "set-piece";
import { PlayerModel } from "../entities/player";

export class SpellPlayPrevEvent extends PrevEvent<{}> {
    protected _brand: symbol = Symbol('spell-play-prev-event');
}

export class SpellPlayPostEvent extends PostEvent<{}, undefined> {
    protected _brand: symbol = Symbol('spell-play-post-event');
}

export function usePlayerSpellCast<I extends Model & { player: PlayerModel | undefined }>() {
    return function(
        prototype: I,
        key: string,
        descriptor: TypedPropertyDescriptor<(event: SpellPlayPostEvent) => void>
    ) {
        useEventConsumer((i: I) => {
            const cards = i.player?.cards ?? [];
            const launchers = cards.map(card => card.deployer);
            return [launchers, SpellPlayPostEvent] 
        })(prototype, key, descriptor);
    }
}
