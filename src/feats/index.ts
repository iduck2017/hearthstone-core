import { useRoute, useState, Model, useMemo, useDecorProducer, useChild } from "set-piece";
import { GameModel } from "../entities/game";
import { PlayerModel } from "../entities/player";
import { HeroModel } from "..";
import { RoleModel } from "..";
import { CardModel } from "..";
import { FeatActiveDecor } from "../decors/feat-active";

export interface RoleFeatIntf extends FeatIntf {
    role: RoleModel | undefined
}

export interface FeatIntf extends Model {
    feat: FeatModel | undefined,
    player: PlayerModel | undefined
    game: GameModel | undefined
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

    @useRoute(() => GameModel)
    private _game?: GameModel;
    @useMemo()
    public get game() { return this._game }
}

export abstract class FeatModel extends Model {
    constructor(props?: {
        isActived?: boolean;
        subFeats?: SubFeatModel[]
    }) {
        super();
        this._isActived = props?.isActived ?? true;
        this._isOriginal = false;
        this._subFeats = props?.subFeats ?? [];
    }

    @useDecorProducer(() => FeatActiveDecor)
    @useState()
    private _isActived: boolean;
    @useMemo()
    public get isActived() { return this._isActived }
    public active() { this._isActived = true }
    public disable() { this._isActived = false }

    @useState()
    private _isOriginal: boolean;
    @useMemo()
    public get isOriginal() { return this._isOriginal }
    public set isOriginal(flag: boolean) {
        this._isOriginal = flag;
    }

    @useChild()
    private _subFeats: SubFeatModel[];
    public get subFeats() {
        return this._subFeats;
    }

    @useRoute(() => GameModel)
    private _game?: GameModel;
    @useMemo()
    public get game() { return this._game }

    @useRoute(() => PlayerModel)
    protected _player?: PlayerModel;
    @useMemo()
    public get player() { return this._player }

    @useRoute(() => HeroModel)
    protected _hero?: HeroModel;
    @useRoute(() => CardModel)
    protected _card?: CardModel;
    @useMemo()
    public get entity() { return this._hero ?? this._card }

    public get feat() { return this; }
}