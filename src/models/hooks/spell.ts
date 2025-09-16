import { Model } from "set-piece";
import { EffectModel } from "../features/effect";

export type SpellHooksEvent = {
    effect: Map<EffectModel, Model[]>;
}
