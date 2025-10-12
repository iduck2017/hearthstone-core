import { Decor, Method, StateUtil, TemplUtil } from "set-piece";
import { FeatureModel } from "../../features";
import { SpellEffectDecor, SpellEffectModel } from "../../..";
import { CardFeaturesModel } from "../../features/group/card";
import { CardFeatureModel } from "../../features/card";

export namespace SpellDamageModel {
    export type E = {};
    export type S = {
        offset: number;
    };
    export type C = {};
    export type R = {};
}

@TemplUtil.is('spell-damage')
export class SpellDamageModel extends CardFeatureModel<
    SpellDamageModel.E,
    SpellDamageModel.S,
    SpellDamageModel.C,
    SpellDamageModel.R
>  {
    constructor(props?: SpellDamageModel['props']) {
        super({
            uuid: props?.uuid,
            state: {
                offset: 0,
                name: 'Spell Damage',
                desc: 'Your spell cards deal extra damage.',
                isActive: true,
                ...props?.state,
            },
            child: { ...props?.child },
            refer: { ...props?.refer },
        });
    }

    @StateUtil.on(self => self.modifyDamage)
    private listenDamage() {
        return this.route.player?.proxy.any(SpellEffectModel).decor;
    }
    private modifyDamage(that: SpellEffectModel, decor: SpellEffectDecor) {
        if (!this.route.player) return;
        if (!this.state.isActive) return;
        decor.add(this.state.offset);
    }
}