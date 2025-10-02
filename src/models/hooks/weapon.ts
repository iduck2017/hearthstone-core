import { Loader, Model, StoreUtil } from "set-piece";
import { RoleBattlecryModel } from "./battlecry/role";
import { DeathrattleModel } from "./deathrattle";
import { StartTurnHookModel } from "./start-turn";
import { EndTurnHookModel } from "./end-turn";
import { WeaponBattlecryModel } from "./battlecry/weapon";

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
export class WeaponHooksModel extends Model<
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


    public add(hook: WeaponBattlecryModel): RoleBattlecryModel;
    public add(hook: DeathrattleModel): DeathrattleModel;
    public add(hook: StartTurnHookModel): StartTurnHookModel;
    public add(hook: EndTurnHookModel): EndTurnHookModel;
    public add<T extends 
        WeaponBattlecryModel | 
        DeathrattleModel | 
        StartTurnHookModel | 
        EndTurnHookModel
    >(hook: T): T {
        if (hook instanceof WeaponBattlecryModel) this.draft.child.battlecry.push(hook);
        if (hook instanceof DeathrattleModel) this.draft.child.deathrattle.push(hook);
        if (hook instanceof StartTurnHookModel) this.draft.child.startTurn.push(hook);
        if (hook instanceof EndTurnHookModel) this.draft.child.endTurn.push(hook);
        return hook;
    }
}