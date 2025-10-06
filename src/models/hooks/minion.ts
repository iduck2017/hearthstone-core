import { Loader, Model, StoreUtil } from "set-piece";
import { RoleBattlecryModel } from "../..";
import { DeathrattleModel } from "../..";
import { StartTurnHookModel } from "../..";
import { EndTurnHookModel } from "../..";
import { CardHooksModel } from "./card";

export namespace MinionHooksProps {
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
export class MinionHooksModel extends CardHooksModel<
    MinionHooksProps.E,
    MinionHooksProps.S,
    MinionHooksProps.C,
    MinionHooksProps.R
> {
    constructor(loader?: Loader<MinionHooksModel>) {
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


    public add(hook: RoleBattlecryModel): RoleBattlecryModel;
    public add(hook: DeathrattleModel): DeathrattleModel;
    public add(hook: StartTurnHookModel): StartTurnHookModel;
    public add(hook: EndTurnHookModel): EndTurnHookModel;
    public add<T extends 
        RoleBattlecryModel | 
        DeathrattleModel | 
        StartTurnHookModel | 
        EndTurnHookModel
    >(hook: T): T {
        if (hook instanceof RoleBattlecryModel) this.draft.child.battlecry.push(hook);
        if (hook instanceof DeathrattleModel) this.draft.child.deathrattle.push(hook);
        if (hook instanceof StartTurnHookModel) this.draft.child.startTurn.push(hook);
        if (hook instanceof EndTurnHookModel) this.draft.child.endTurn.push(hook);
        return hook;
    }
}