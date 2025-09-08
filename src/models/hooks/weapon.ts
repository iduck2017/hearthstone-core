import { Loader, Model, StoreUtil } from "set-piece";
import { BattlecryModel } from "./battlecry";
import { DeathrattleModel } from "./deathrattle";
import { StartTurnHookModel } from "./start-turn";
import { EndTurnHookModel } from "./end-turn";

export namespace WeaponHooksProps {
    export type E = {};
    export type S = {};
    export type C = {
        readonly endTurn: EndTurnHookModel[];
        readonly startTurn: StartTurnHookModel[];
        readonly battlecry: BattlecryModel[];
        readonly deathrattle: DeathrattleModel[];
    };
    export type R = {};
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
                refer: { ...props.refer }
            }
        });
    }


    public add(hook: BattlecryModel): BattlecryModel;
    public add(hook: DeathrattleModel): DeathrattleModel;
    public add(hook: StartTurnHookModel): StartTurnHookModel;
    public add(hook: EndTurnHookModel): EndTurnHookModel;
    public add<T extends 
        BattlecryModel | 
        DeathrattleModel | 
        StartTurnHookModel | 
        EndTurnHookModel
    >(hook: T): T {
        if (hook instanceof BattlecryModel) this.draft.child.battlecry.push(hook);
        if (hook instanceof DeathrattleModel) this.draft.child.deathrattle.push(hook);
        if (hook instanceof StartTurnHookModel) this.draft.child.startTurn.push(hook);
        if (hook instanceof EndTurnHookModel) this.draft.child.endTurn.push(hook);
        return hook;
    }
}