import { useChild, useMemo } from "set-piece";
import { CardModel, CardProps } from ".";
import { SpellEffectModel } from "../feats/spell-effect";
import { SpellLauncherModel } from "../rules/deployers/spell-launcher";

export interface SpellProps extends CardProps {}
export abstract class SpellModel extends CardModel {
    constructor(props: SpellProps) {
        super(props);
    }

    @useChild()
    protected _deployer: SpellLauncherModel = new SpellLauncherModel();

    @useMemo()
    public get spellEffects() {
        return this.feats.filter(i => i instanceof SpellEffectModel);
    }
}