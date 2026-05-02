import { useAction, useChild, useMemo } from "set-piece";
import { CardModel, CardProps } from ".";
import { RoleModel } from "../entities/role";
import { MinionDisposerModel } from "../rules/disposers/minion-disposer";
import { MinionDeployerModel } from "../rules/deployers/minion-deployer";
import { BoardModel } from "../entities/board";
import { RaceType } from "../utils/enums";
import { PlayerModel } from "../entities/player";

export interface MinionProps extends CardProps {
    role: RoleModel;
    races: RaceType[];
}
export abstract class MinionModel extends CardModel {
    constructor(props: MinionProps) {
        super(props);
        this._role = props.role;
        this._races = props.races ?? [];
        this._disposer = new MinionDisposerModel();
    }

    @useChild()
    private _role: RoleModel;
    @useMemo()
    public get role() {
        return this._role;
    }

    private _races: RaceType[];
    @useMemo()
    public get races() {
        return [...this._races];
    }

    @useChild()
    protected _disposer: MinionDisposerModel;
    @useMemo()
    public get disposer() {
        return this._disposer;
    }

    @useChild()
    protected _deployer: MinionDeployerModel = new MinionDeployerModel();
    @useMemo()
    public get deployer() {
        return this._deployer;
    }


}
