import { StateUtil, TemplUtil } from "set-piece";
import { SpellEffectDecor, SpellEffectModel } from "../..";
import { FeatureModel } from "../features";

export namespace SpellDamageModel {
    export type E = {};
    export type S = {
        offset: number;
    };
    export type C = {};
    export type R = {};
}

@TemplUtil.is('spell-damage')
export class SpellDamageModel extends FeatureModel<
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
                isEnabled: true,
                ...props?.state,
            },
            child: { ...props?.child },
            refer: { ...props?.refer },
        });
    }

    @StateUtil.on(self => self.modifyDamage)
    protected listenDamage() {
        const player = this.route.player;
        if (!player) return;
        const effect = player.proxy.any(SpellEffectModel);
        if (!effect) return;
        return effect.decor;
    }
    protected modifyDamage(that: SpellEffectModel, decor: SpellEffectDecor) {
        if (!this.state.isEnabled) return;
        decor.add(this.state.offset);
    }

    
}