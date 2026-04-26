import { useChild } from "set-piece";
import { CardModel, CardProps } from ".";
import { HookRegistry, HooksLauncherModel } from "../rules/hooks-launcher";
import { SpellEffectModel } from "../feats/spell-effect";

export interface SpellProps extends CardProps {}
export abstract class SpellModel extends CardModel {
    constructor(props: SpellProps) {
        super(props);
    }

    @useChild()
    private _launcher?: HooksLauncherModel;

    public get spellEffects() {
        return this.feats.filter(i => i instanceof SpellEffectModel);
    }

    public async play(): Promise<void> {
        const player = this.player;
        if (!player) return;

        // Collect targets for each spell effect before consuming mana
        const hookRegistry: HookRegistry = [];
        for (const hook of this.spellEffects) {
            const params = await hook.getTargets();
            hookRegistry.push({ hook, params });
        }

        // Consume mana
        this.consumeMana();

        // Execute spell effects (card stays in hand so Spell Damage auras remain active)
        this._launcher = new HooksLauncherModel({ registry: hookRegistry });
        while (true) {
            const isFinished = await this._launcher.next();
            if (isFinished) break;
        }
        this._launcher = undefined;

        // Remove from hand and enter graveyard after all effects resolve
        this.container?.removeCard(this);
        player.graveyard.disposeCard(this);
    }
}
