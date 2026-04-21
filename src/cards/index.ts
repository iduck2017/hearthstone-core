import { Model, useChild, useMemo, useRoute } from "set-piece";
import { BoardModel } from "../entities/board";
import { DeckModel } from "../entities/deck";
import { HandModel } from "../entities/hand";
import { GraveyardModel } from "../entities/graveyard";
import { GameModel } from "../entities/game";
import { PlayerModel } from "../entities/player";
import { CostModel } from "../rules/cost";
import { BattlecryModel } from "../features/battlecry";
import { DeathrattleModel } from "../features/deathrattle";
import { FeatureModel } from "../features";
import { DisposerModel } from "../rules/disposers";

export interface CardProps {
    cost: CostModel;
    features?: FeatureModel[];
}

export abstract class CardModel extends Model {
    constructor(props: CardProps) {
        super();
        this._cost = props?.cost ?? new CostModel();
        this._features = props?.features ?? [];
        this.init()
    }

    @useRoute(() => BoardModel)
    private _board?: BoardModel;

    @useRoute(() => HandModel)
    private _hand?: HandModel;

    @useRoute(() => DeckModel)
    private _deck?: DeckModel;

    @useRoute(() => GraveyardModel)
    private _graveyard?: GraveyardModel;

    @useMemo()
    public get container() {
        return this._board ??
            this._hand ??
            this._deck ??
            this._graveyard;
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
    public get player() {
        return this._player;
    }

    @useChild()
    private _cost: CostModel;
    @useMemo()
    protected consumeMana() {
        if (!this._player) return;
        const cost = this._cost.current;
        this._player.mana.consume(cost);
    }

    @useMemo()
    public get battlecries() {
        return this.features.filter(i => i instanceof BattlecryModel);
    }

    @useMemo()
    public get deathrattles() {
        return this.features.filter(i => i instanceof DeathrattleModel);
    }

    @useChild()
    protected abstract _disposer: DisposerModel;
    @useMemo()
    public get disposer() {
        return this._disposer;
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
    public abstract play(): Promise<void>;

}