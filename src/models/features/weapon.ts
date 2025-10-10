import { MinionBattlecryModel } from "../..";
import { DeathrattleModel } from "../..";
import { StartTurnHookModel } from "../..";
import { EndTurnHookModel } from "../..";
import { WeaponBattlecryModel } from "../..";
import { CardFeatsModel } from "./card";
import { FeatureModel } from "../rules/feature";
import { Model, TemplUtil } from "set-piece";

export namespace WeaponFeatsModel {
    export type E = {};
    export type S = {};
    export type C = {
        readonly endTurn: EndTurnHookModel[];
        readonly startTurn: StartTurnHookModel[];
        readonly battlecry: WeaponBattlecryModel[];
        readonly deathrattle: DeathrattleModel[];
    };
    export type R = {};
}


export type WeaponHooksOptions = {
    battlecry: Map<WeaponBattlecryModel, Model[]>
}

@TemplUtil.is('card-hooks')
export class WeaponFeatsModel extends CardFeatsModel<
    WeaponFeatsModel.E,
    WeaponFeatsModel.S,
    WeaponFeatsModel.C,
    WeaponFeatsModel.R
> {
    constructor(props?: WeaponFeatsModel['props']) {
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
        if (feat instanceof WeaponBattlecryModel) return this.origin.child.battlecry;
        if (feat instanceof DeathrattleModel) return this.origin.child.deathrattle;
        if (feat instanceof StartTurnHookModel) return this.origin.child.startTurn;
        if (feat instanceof EndTurnHookModel) return this.origin.child.endTurn;
        return this.origin.child.list;
    }
}