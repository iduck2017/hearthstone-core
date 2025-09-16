import { Event } from "set-piece";
import { PerformModel } from ".";
import { EffectModel } from "../../features/effect";
import { SpellHooksEvent } from "../../hooks/spell";

export class SpellPerformModel extends PerformModel<
    [SpellHooksEvent]
> {
    public async toRun(): Promise<[SpellHooksEvent] | undefined> {
        // status 
        const spell = this.route.spell;
        if (!spell) return;
        if (!spell.state.isActive) return;
        // spell
        const effect = await EffectModel.toRun(spell.child.effects);
        if (!effect) return;
        return [{ effect }];
    }
    
    public async run(from: number, event: SpellHooksEvent) {
        const spell = this.route.spell;
        if (!spell) return;
        
        const signal = new Event({})
        this.event.toRun(signal);
        if (signal.isCancel) return;
        
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