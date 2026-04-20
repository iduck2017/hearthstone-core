import { useChild, useState, Model, useMemo } from "set-piece";
import { HeroDisposerModel } from "../rules/disposers/hero";
import { RoleModel, RoleProps } from "../entities/role";
import { FeatureModel } from "../features";
import { DeathrattleModel } from "../features/deathrattle";

export interface HeroProps extends RoleProps {
    features?: FeatureModel[];
}

export abstract class HeroModel extends Model {
    constructor(props: HeroProps) {
        super();
        this._role = new RoleModel(props);
        this._deathrattles = [];
        this._disposer = new HeroDisposerModel();
        this._features = props?.features ?? [];
    }

    @useChild()
    private _deathrattles: DeathrattleModel[];
    @useMemo()
    public get deathrattles() {
        return [...this._deathrattles];
    }

    @useChild()
    public _features: FeatureModel[];
    @useMemo()
    public get features() {
        return [...this._features];
    }

    public addFeature(buff: FeatureModel) {
        this._features.push(buff);
    }

    public removeFeature(buff: FeatureModel) {
        const index = this._features.indexOf(buff);
        if (index !== -1) {
            this._features.splice(index, 1);
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