import { Model, useAction, useChild, useMemo, useRoute } from "set-piece";
import { LauncherModel } from "../rules/launcher";
import { BoardModel } from "../entities/board";
import { DeckModel } from "../entities/deck";
import { HandModel } from "../entities/hand";
import { GraveyardModel } from "../entities/graveyard";
import { GameModel } from "../entities/game";
import { PlayerModel } from "../entities/player";
import { CostModel } from "../rules/cost";
import { BattlecryModel } from "../feats/battlecry";
import { DeathrattleModel } from "../feats/deathrattle";
import { FeatModel } from "../feats";
import { DisposerModel } from "../rules/disposers";
import { DamageSourceModel } from "../rules/damage-source";
import { RestoreSourceModel } from "../rules/restore-source";
import { RarityType } from "../rules/rarity";
import { ClassType } from "../rules/class";

export interface CardProps {
    cost: CostModel;
    feats?: FeatModel[];
    rarity: RarityType;
    class: ClassType;
}

export abstract class CardModel extends Model {
    constructor(props: CardProps) {
        super();
        this._cost = props?.cost ?? new CostModel();
        this._feats = props?.feats ?? [];
        this._rarity = props.rarity;
        this._class = props.class;
    }

    private _rarity: RarityType;
    @useMemo()
    public get rarity() {
        return this._rarity;
    }

    private _class: ClassType;
    @useMemo()
    public get class() {
        return this._class;
    }
    @useRoute(() => HandModel)
    private _hand?: HandModel;

    @useRoute(() => GameModel)
    private _game?: GameModel;
    @useMemo()
    public get game() {
        return this._game;
    }

    @useRoute(() => PlayerModel)
    private _player?: PlayerModel;
    @useMemo()
    public get player() {
        return this._player;
    }

    @useChild()
    private _cost: CostModel;
    @useMemo()
    public consumeMana() {
        if (!this._player) return;
        const cost = this._cost.current;
        this._player.mana.consume(cost);
    }

    @useMemo()
    public get battlecries() {
        return this.feats.filter(i => i instanceof BattlecryModel);
    }

    @useMemo()
    public get deathrattles() {
        return this.feats.filter(i => i instanceof DeathrattleModel);
    }

    @useChild()
    protected _disposer?: DisposerModel;
    @useMemo()
    public get disposer() {
        return this._disposer;
    }

    @useChild()
    private _damageSource: DamageSourceModel = new DamageSourceModel();
    @useMemo()
    public get damageSource() {
        return this._damageSource;
    }

    @useChild()
    private _restoreSource: RestoreSourceModel = new RestoreSourceModel();
    @useMemo()
    public get restoreSource() {
        return this._restoreSource;
    }

    @useChild()
    public _feats: FeatModel[];
    @useMemo()
    public get feats() {
        return [...this._feats];
    }
    
    public addFeat(buff: FeatModel) {
        this._feats.push(buff);
    }

    public removeFeat(buff: FeatModel) {
        const index = this._feats.indexOf(buff);
        if (index !== -1) return;
        this._feats.splice(index, 1);
    }

    @useMemo()
    public get isPlayable() {
        if (!this._hand) return false;
        if (!this._player) return false;
        if (!this._game) return false;
        const currentPlayer = this._game.currentPlayer;
        if (currentPlayer !== this._player) return false;
        const mana = this._player.mana.current;
        const cost = this._cost.current;
        if (mana < cost) return false;
        return true;
    }

    @useChild()
    protected abstract _launcher: LauncherModel;
    @useMemo()
    public get launcher() {
        return this._launcher;
    }

    public async play() {
        if (!this.isPlayable) return;
        return this._launcher.launch();
    }
}
