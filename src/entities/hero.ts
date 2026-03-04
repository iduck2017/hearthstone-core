import { asChild, asState, Model } from "set-piece";
import { RoleHealthModel } from "../rules/role-health";
import { RoleAttackModel } from "../rules/role-attack";
import { RoleModel, RoleProps } from "./role";
import { DeathrattleModel } from "../hooks/deathrattle";
import { TauntModel } from "../rules/taunt";
import { DisposerModel } from "../rules/disposers";
import { HeroDisposerModel } from "../rules/disposers/hero-disposer";

export abstract class HeroModel extends Model {
    constructor(props: {
        taunt?: TauntModel;
        health?: RoleHealthModel;
        attack?: RoleAttackModel;
    }) {
        super();
        this._role = new RoleModel({
            taunt: props.taunt,
            attack: props.attack ?? new RoleAttackModel({ origin: 0 }),
            health: props.health ?? new RoleHealthModel({ origin: 30 }),
        });
        this._disposer = new HeroDisposerModel();
    }

    private _deathrattles: DeathrattleModel[] = [];
    public get deathrattles() {
        return this._deathrattles;
    }

    @asChild()
    private _role: RoleModel;
    public get role() {
        return this._role;
    }

    @asChild()
    private _disposer: HeroDisposerModel;
    public get disposer() {
        return this._disposer;
    }

}