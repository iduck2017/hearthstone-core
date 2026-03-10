import { useRoute, useState, Model } from "set-piece";
import { getFeatDeactiveHooks } from "../utils/use-feat-deactive-hook";
import { GameModel } from "../entities/game";
import { MinionModel } from "../entities/minion";
import { HeroModel } from "../entities/hero";
import { PlayerModel } from "../entities/player";
import { BoardModel } from "../entities/board";

export abstract class FeatureModel extends Model {
    constructor(props?: {
        isActived?: boolean;
    }) {
        super();
        this._isActived = props?.isActived ?? true;
    }

    @useState()
    private _isActived: boolean;
    public get isActived() {
        return this._isActived;
    }


    @useRoute(() => GameModel)
    private _game?: GameModel;
    protected get game() {
        return this._game;
    }

    @useRoute(() => PlayerModel)
    private _player?: PlayerModel;
    protected get player() {
        return this._player;
    }
    
    @useRoute(() => MinionModel)
    private _minion?: MinionModel;
    protected get minion() {
        return this._minion;
    }

    @useRoute(() => HeroModel)
    private _hero?: HeroModel;
    protected get hero() {  
        return this._hero;
    }

    protected get container() {
        return this._minion ?? this._hero;
    }



    protected deactive() {
        const hooks = getFeatDeactiveHooks(this);
        hooks.forEach(hook => hook());
        this._isActived = false;
    }
}