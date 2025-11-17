import { MinionCardModel } from "../../models/entities/cards/minion";
import { HeroModel, RoleModel } from "../../models/entities/heroes";
import { SpellHooksConfig } from "../../models/features/perform/spell";
import { AbortEvent } from "./abort";

export class SpellCastEvent extends AbortEvent<{ config: SpellHooksConfig }> {
    public redirect(target: RoleModel) {
        const effects = this.origin.config.effects;
        effects.forEach((value, key) => {
            value.forEach((item, index) => {
                if (item instanceof MinionCardModel) value[index] = target;
                if (item instanceof HeroModel) value[index] = target;
            })
        })
    }
}
