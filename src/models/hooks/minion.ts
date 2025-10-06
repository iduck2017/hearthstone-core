import { Loader, Model, StoreUtil } from "set-piece";
import { FeatureModel, RoleBattlecryModel } from "../..";
import { DeathrattleModel } from "../..";
import { StartTurnHookModel } from "../..";
import { EndTurnHookModel } from "../..";
import { CardFeatsModel } from "./card";

export namespace MinionFeatsProps {
    export type E = {};
    export type S = {};
    export type C = {
        readonly endTurn: EndTurnHookModel[];
        readonly startTurn: StartTurnHookModel[];
        readonly battlecry: RoleBattlecryModel[];
        readonly deathrattle: DeathrattleModel[];
    };
    export type R = {};
}

export type MinionHooksOptions = {
    battlecry: Map<RoleBattlecryModel, Model[]>
}

@StoreUtil.is('card-hooks')
export class MinionFeatsModel extends CardFeatsModel<
    MinionFeatsProps.E,
    MinionFeatsProps.S,
    MinionFeatsProps.C,
    MinionFeatsProps.R
> {
    constructor(loader?: Loader<MinionFeatsModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: { 
                    endTurn: [],
                    startTurn: [],
                    battlecry: [],
                    deathrattle: [],
                    ...props.child 
                },
                refer: { ...props.refer },
                route: {},
            }
        });
    }


    protected query(feat: FeatureModel): FeatureModel[] | undefined {
        if (feat instanceof RoleBattlecryModel) return this.draft.child.battlecry;
        if (feat instanceof DeathrattleModel) return this.draft.child.deathrattle;
        if (feat instanceof StartTurnHookModel) return this.draft.child.startTurn;
        if (feat instanceof EndTurnHookModel) return this.draft.child.endTurn;
        return this.draft.child.items;
    }
}