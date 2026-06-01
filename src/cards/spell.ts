import { useChild, useMemo } from "set-piece";
import { CardModel, CardProps } from ".";
import { SpellEffectModel } from "../feats/spell-effect";
import { SpellDeployerModel } from "../rules/deployers/spell-deployer";

export interface SpellProps extends CardProps {}
export abstract class SpellModel extends CardModel {
    constructor(props: SpellProps) {
        super(props);
    }

    @useChild()
    protected _deployer: SpellDeployerModel = new SpellDeployerModel();

    @useMemo()
    public get spellEffects() {
        return this.feats.filter(i => i instanceof SpellEffectModel);
    }
}