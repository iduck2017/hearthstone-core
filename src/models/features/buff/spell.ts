import { Decor, Event, Method, StateUtil, StoreUtil } from "set-piece";
import { FeatureModel } from "..";
import { RoleFeatureModel } from "../role";
import { CardModel } from "../../cards";
import { PlayerModel } from "../../player";
import { SpellAttackModel, SpellAttackProps } from "../../rules/attack/spell";

export namespace SpellBuffProps {
    export type E = {
        onActive: Event;
    };
    export type S = {
        current: number;
    };
    export type C = {};
    export type R = {};
}

@StoreUtil.is('spell-damage')
export class SpellBuffModel extends RoleFeatureModel<
    SpellBuffProps.E,
    SpellBuffProps.S,
    SpellBuffProps.C,
    SpellBuffProps.R
>  {
    constructor(loader: Method<SpellBuffModel['props'] & {
        state: Pick<SpellBuffProps.S, 'current'>
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

    @StateUtil.on(self => self.route.player?.proxy.child.hero.child.spellAttack.decor)
    onCheck(that: SpellAttackModel, decor: Decor<SpellAttackProps.S>) {
        if (!this.route.board) return;
        if (!this.state.isActive) return;
        decor.draft.current += this.state.current;
    }

}