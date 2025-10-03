import { Event, Model } from "set-piece";
import { EffectModel } from "../features/effect";
import { RoleModel } from "../..";

export type SpellHooksOptions = {
    effect: Map<EffectModel, Model[]>;
}

export class SpellCastEvent extends Event<{ options: SpellHooksOptions }> {
    public redirect(role: RoleModel) {
        this._detail.options.effect.forEach((value, key) => {
            value.forEach((item, index) => {
                if (item instanceof RoleModel) value[index] = role;
            })
        })
    }
}