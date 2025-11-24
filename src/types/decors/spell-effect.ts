import { Decor, Model } from "set-piece";
import { SpellEffectModel } from "../../models/features/hooks/spell-effect";
import { EffectModel } from "../../models/features/hooks/effect";
import { FeatureModel } from "../../models/features";

export class SpellEffectDecor<S extends Model.S = {}> extends Decor<
    SpellEffectModel.S & EffectModel.S & FeatureModel.S & S
> {
    public add(value: number) {
        this._origin.offset = this._origin.offset + value;
    }
}