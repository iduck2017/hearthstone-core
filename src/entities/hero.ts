import { asChild, asChildList, asState, Model } from "set-piece";
import { RoleHealthModel } from "../rules/role-health";
import { RoleAttackModel } from "../rules/role-attack";
import { RoleModel, RoleProps } from "./role";
import { DeathrattleModel } from "../hooks/deathrattle";
import { DisposerModel } from "../rules/disposers";
import { HeroDisposerModel } from "../rules/disposers/hero-disposer";
import { FeatureModel } from "../features";

export interface HeroProps extends RoleProps {
}

export abstract class HeroModel extends Model {
    constructor(props: HeroProps) {
        super();
        this._role = new RoleModel(props);
        this._buffs = [];
        this._deathrattles = [];
        this._disposer = new HeroDisposerModel();
    }

    @asChildList()
    private _deathrattles: DeathrattleModel[];
    public get deathrattles() {
        return [...this._deathrattles];
    }

    @asChildList()
    public _buffs: FeatureModel[];
    public get buffs() {
        return [...this._buffs];
    }

    public addBuff(buff: FeatureModel) {
        this._buffs.push(buff);
    }

    public removeBuff(buff: FeatureModel) {
        const index = this._buffs.indexOf(buff);
        if (index !== -1) {
            this._buffs.splice(index, 1);
        }
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