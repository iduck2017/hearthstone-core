import { Model, TemplUtil } from "set-piece";
import { FeatureModel, MinionBattlecryModel } from "../../..";
import { DeathrattleModel } from "../../..";
import { StartTurnHookModel } from "../../..";
import { EndTurnHookModel } from "../../..";
import { CardFeaturesModel } from "./card";

export namespace MinionFeaturesModel {
    export type E = {};
    export type S = {};
    export type C = {
        readonly endTurn: EndTurnHookModel[];
        readonly startTurn: StartTurnHookModel[];
        readonly battlecry: MinionBattlecryModel[];
        readonly deathrattle: DeathrattleModel[];
    };
    export type R = {};
}

export type MinionHooksOptions = {
    battlecry: Map<MinionBattlecryModel, Model[]>
}

@TemplUtil.is('card-hooks')
export class MinionFeaturesModel extends CardFeaturesModel<
    MinionFeaturesModel.E,
    MinionFeaturesModel.S,
    MinionFeaturesModel.C,
    MinionFeaturesModel.R
> {
    public get chunk() {
        const result = super.chunk;
        return {
            ...result,
            endTurn: this.child.endTurn.map(item => item.chunk).filter(Boolean),
            startTurn: this.child.startTurn.map(item => item.chunk).filter(Boolean),
            battlecry: this.child.battlecry.map(item => item.chunk).filter(Boolean),
            deathrattle: this.child.deathrattle.map(item => item.chunk).filter(Boolean),
        }
    }

    constructor(props?: MinionFeaturesModel['props']) {
        super({
            uuid: props?.uuid,
            state: { ...props?.state },
            child: { 
                endTurn: [],
                startTurn: [],
                battlecry: [],
                deathrattle: [],
                ...props?.child 
            },
            refer: { ...props?.refer },
        });
    }

    protected query(feat: FeatureModel): FeatureModel[] | undefined {
        if (feat instanceof MinionBattlecryModel) return this.origin.child.battlecry;
        if (feat instanceof DeathrattleModel) return this.origin.child.deathrattle;
        if (feat instanceof StartTurnHookModel) return this.origin.child.startTurn;
        if (feat instanceof EndTurnHookModel) return this.origin.child.endTurn;
        return this.origin.child.feats;
    }
}