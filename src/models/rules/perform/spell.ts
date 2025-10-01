import { Event, Loader } from "set-piece";
import { PerformModel } from ".";
import { EffectModel } from "../../features/effect";
import { SpellHooksEvent } from "../../hooks/spell";
import { SpellCardModel } from "../../cards/spell";

export class SpellPerformEvent extends Event<{ params: SpellHooksEvent }> {
    public set(params: SpellHooksEvent) { this._detail.params = params; }
}

export namespace SpellPerformProps {
    export type E = {
        toRun: SpellPerformEvent;
    };
    export type S = {};
    export type C = {};
    export type R = {};
    export type P = { spell: SpellCardModel; };
}

export class SpellPerformModel extends PerformModel<
    [SpellHooksEvent],
    SpellPerformProps.E,
    SpellPerformProps.S,
    SpellPerformProps.C,
    SpellPerformProps.R,
    SpellPerformProps.P
> {
    constructor(loader?: Loader<SpellPerformModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: { ...props.child },
                refer: { ...props.refer },
                route: { spell: SpellCardModel.prototype },
            }
        });
    }
    
    public async toRun(): Promise<[SpellHooksEvent] | undefined> {
        const spell = this.route.spell;
        if (!spell) return;
        // spell
        const effect = await EffectModel.toRun(spell.child.effects);
        if (!effect) return;
        return [{ effect }];
    }
    
    public async run(from: number, event: SpellHooksEvent) {
        const spell = this.route.spell;
        if (!spell) return;
        
        const signal = new SpellPerformEvent({ params: event })
        this.event.toRun(signal);
        if (signal.isAbort) return;
        event = signal.detail.params;
        
        const player = this.route.player;
        if (!player) return;
        // spell
        const effects = spell.child.effects;
        for (const item of effects) {
            const params = event.effect.get(item);
            if (!params) continue;
            await item.run(...params);
        }
        const board = player.child.board;
        spell.child.deploy?.run(board);
    }
}