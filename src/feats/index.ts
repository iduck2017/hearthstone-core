import { useRoute, useState, Model, useMemo } from "set-piece";
import { GameModel } from "../entities/game";
import { PlayerModel } from "../entities/player";
import { MinionModel } from "../cards/minion";
import { HeroModel } from "../heroes";
import { RoleModel } from "../entities/role";
import { CardModel } from "../cards";

export interface RoleFeatureModel extends Model {
    role: RoleModel | undefined
    feat: FeatModel | undefined
}

export abstract class FeatModel extends Model {
    constructor(props?: {
        isActived?: boolean;
    }) {
        super();
        this._isActived = props?.isActived ?? true;
    }

    @useState()
    private _isActived: boolean;
    @useMemo()
    public get isActived() {
        return this._isActived;
    }
    protected deactive() {
        this._isActived = false;
    }

    @useRoute(() => GameModel)
    private _game?: GameModel;
    @useMemo()
    public get game() {
        return this._game;
    }

    @useRoute(() => PlayerModel)
    private _player?: PlayerModel;
    @useMemo()
    protected get player() {
        return this._player;
    }

    @useRoute(() => HeroModel)
    protected _hero?: HeroModel;
    @useRoute(() => CardModel)
    protected _card?: CardModel;
    @useMemo()
    public get entity() {
        return this._hero ?? this._card
    }

    public get feat() {
        return this;
    }
}