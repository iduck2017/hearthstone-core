import { useChild, Model, useMemo } from "set-piece";
import { HeroDisposerModel } from "../rules/disposers/hero-disposer";
import { RoleModel, RoleProps } from "../entities/role";
import { FeatModel } from "../feats";
import { DeathrattleModel } from "../feats/deathrattle";
import { DamageSourceModel } from "../rules/damage-source";
import { RestoreSourceModel } from "../rules/restore-source";

export interface HeroProps extends RoleProps {
    feats?: FeatModel[];
}

export abstract class HeroModel extends Model {
    constructor(props: HeroProps) {
        super();
        this._role = new RoleModel(props);
        this._deathrattles = [];
        this._disposer = new HeroDisposerModel();
        this._feats = props?.feats ?? [];
        this._damageSource = new DamageSourceModel();
        this._restoreSource = new RestoreSourceModel();
    }

    @useChild()
    private _damageSource: DamageSourceModel;
    @useMemo()
    public get damageSource() {
        return this._damageSource;
    }

    @useChild()
    private _restoreSource: RestoreSourceModel;
    @useMemo()
    public get restoreSource() {
        return this._restoreSource;
    }

    @useChild()
    private _deathrattles: DeathrattleModel[];
    @useMemo()
    public get deathrattles() {
        return [...this._deathrattles];
    }

    @useChild()
    public _feats: FeatModel[];
    @useMemo()
    public get feats() {
        return [...this._feats];
    }

    public addFeature(buff: FeatModel) {
        this._feats.push(buff);
    }

    public removeFeature(buff: FeatModel) {
        const index = this._feats.indexOf(buff);
        if (index !== -1) {
            this._feats.splice(index, 1);
        }
    }

    @useChild()
    private _role: RoleModel;
    @useMemo()
    public get role() {
        return this._role;
    }

    @useChild()
    private _disposer: HeroDisposerModel;
    @useMemo()
    public get disposer() {
        return this._disposer;
    }

}
