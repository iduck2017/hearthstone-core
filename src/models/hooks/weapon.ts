import { Loader, Model, StoreUtil } from "set-piece";
import { RoleBattlecryModel } from "./battlecry/role";
import { DeathrattleModel } from "./deathrattle";
import { StartTurnHookModel } from "./start-turn";
import { EndTurnHookModel } from "./end-turn";
import { WeaponBattlecryModel } from "./battlecry/weapon";
import { CardHooksModel } from "./card";
import { FeatureModel } from "../features";

export namespace WeaponHooksProps {
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

@StoreUtil.is('card-hooks')
export class WeaponHooksModel extends CardHooksModel<
    WeaponHooksProps.E,
    WeaponHooksProps.S,
    WeaponHooksProps.C,
    WeaponHooksProps.R
> {
    constructor(loader?: Loader<WeaponHooksModel>) {
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
        if (feat instanceof WeaponBattlecryModel) return this.draft.child.battlecry;
        if (feat instanceof DeathrattleModel) return this.draft.child.deathrattle;
        if (feat instanceof StartTurnHookModel) return this.draft.child.startTurn;
        if (feat instanceof EndTurnHookModel) return this.draft.child.endTurn;
        return this.draft.child.items;
    }
}