import { Decor, Method, StateUtil, StoreUtil } from "set-piece";
import { FeatureModel } from "..";
import { SpellDamageDecor, SpellDamageModel, SpellDamageProps } from "../../rules/attack/spell";

export namespace SpellBuffProps {
    export type E = {};
    export type S = {
        offset: number;
    };
    export type C = {};
    export type R = {};
}

@StoreUtil.is('spell-damage')
export class SpellBuffModel extends FeatureModel<
    SpellBuffProps.E,
    SpellBuffProps.S,
    SpellBuffProps.C,
    SpellBuffProps.R
>  {
    constructor(loader: Method<SpellBuffModel['props'] & {
        state: Pick<SpellBuffProps.S, 'offset'>
    }>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Spell Damage',
                    desc: 'Your spell cards deal extra damage.',
                    isActive: true,
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
                route: {},
            }
        });
    }

    @StateUtil.on(self => self.route.player?.proxy.child.hero.child.spellDamage.decor)
    onCheck(that: SpellDamageModel, decor: SpellDamageDecor) {
        if (!this.route.board) return;
        if (!this.state.isActive) return;
        decor.add(this.state.offset);
    }

}