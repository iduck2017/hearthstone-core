import { useRoute, useState, Model, useMemo, useDecorProducer, useChild } from "set-piece";
import { GameModel } from "../entities/game";
import { PlayerModel } from "../entities/player";
import { HeroModel } from "..";
import { RoleModel } from "..";
import { CardModel } from "..";
import { FeatActiveDecor } from "../decors/feat-active";

export interface RoleFeatModel extends Model {
    role: RoleModel | undefined
    feat: FeatModel | undefined,
    player: PlayerModel | undefined
}

export interface BaseFeatModel extends Model {
    feat: FeatModel | undefined,
    player: PlayerModel | undefined
}

export abstract class SubFeatModel extends Model {
    @useRoute(() => FeatModel)
    private _feat?: FeatModel
    @useMemo()
    public get feat() { return this._feat }

    @useRoute(() => PlayerModel)
    protected _player?: PlayerModel;
    @useMemo()
    public get player() { return this._player }
}

export abstract class FeatModel extends Model {
    constructor(props?: {
        isActived?: boolean;
        subFeats?: SubFeatModel[]
    }) {
        super();
        this._isActived = props?.isActived ?? true;
        this._subFeats = props?.subFeats ?? [];
    }

    @useDecorProducer(() => FeatActiveDecor)
    @useState()
    private _isActived: boolean;
    @useMemo()
    public get isActived() {
        return this._isActived;
    }
    protected deactive() {
        this._isActived = false;
    }

    @useChild()
    private _subFeats: SubFeatModel[];
    public get subFeats() {
        return this._subFeats;
    }

    @useRoute(() => GameModel)
    private _game?: GameModel;
    @useMemo()
    public get game() {
        return this._game;
    }

    @useRoute(() => PlayerModel)
    protected _player?: PlayerModel;
    @useMemo()
    public get player() {
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

    public get feat() { return this; }
}