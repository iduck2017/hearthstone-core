import { Event, Loader } from "set-piece";
import { PerformModel } from ".";
import { EffectModel } from "../../features/effect";
import { SpellCastEvent, SpellHooksOptions } from "../../features/spell";
import { SpellCardModel, SpellEffectModel } from "../../..";

export namespace SpellPerformProps {
    export type E = {
        toRun: SpellCastEvent;
    };
    export type S = {};
    export type C = {};
    export type R = {};
    export type P = { spell: SpellCardModel; };
}

export class SpellPerformModel extends PerformModel<
    [SpellHooksOptions],
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
    
    public async toRun(): Promise<[SpellHooksOptions] | undefined> {
        const spell = this.route.spell;
        if (!spell) return;
        // spell
        const effect = await SpellEffectModel.toRun(spell.child.effects);
        if (!effect) return;
        return [{ effect }];
    }
    
    public async run(from: number, options: SpellHooksOptions) {
        const spell = this.route.spell;
        if (!spell) return;
        
        const event = new SpellCastEvent({ options: options })
        this.event.toRun(event);
        if (event.isAbort) return;
        options = event.detail.options;
        
        const player = this.route.player;
        if (!player) return;
        // spell
        const effects = spell.child.effects;
        for (const item of effects) {
            const params = options.effect.get(item);
            if (!params) continue;
            await item.run(...params);
        }
        const board = player.child.board;
        spell.child.deploy?.run(board);
    }
}