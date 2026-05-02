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

    @useAction()
    public withdraw() {
        const player = this.player;
        if (!player) return;
        player.board.removeCard(this);
        player.hand.addCard(this);
        this._feats = this._feats.filter(feat => feat.isOriginal);
    }


    @useAction()
    public silence() {
        this._feats.forEach(feat => feat.disable());
        this._role.taunt.disable();
        this._role.divineShield.disable();
        this._role.charge.disable();
        this._role.rush.disable();
        this._role.stealth.disable();
    }

}
