import { asChild, asChildList, asRoute, Model } from "set-piece";
import { PlayerModel } from "../entities/player";
import { BoardModel } from "../entities/board";
import { HandModel } from "../entities/hand";
import { DeckModel } from "../entities/deck";
import { BattlecryModel } from "../hooks/battlecry";
import { CostModel } from "../rules/cost";
import { GameModel } from "../entities/game";
import { DeathrattleModel } from "../hooks/deathrattle";
import { GraveyardModel } from "../entities/graveyard";
import { DisposerModel } from "../rules/disposers";

export interface CardProps {
    cost: CostModel;
    battlecries?: BattlecryModel[];
    deathrattles?: DeathrattleModel[];
}

export abstract class CardModel extends Model {
    constructor(props: CardProps) {
        super();
        this._cost = props?.cost ?? new CostModel();
        this._battlecries = props?.battlecries ?? [];
        this._deathrattles = props?.deathrattles ?? [];
    }

    @asRoute(() => BoardModel)
    private _board?: BoardModel;

    @asRoute(() => HandModel)
    private _hand?: HandModel;

    @asRoute(() => DeckModel)
    private _deck?: DeckModel;

    @asRoute(() => GraveyardModel)
    private _graveyard?: GraveyardModel;

    public get container() {
        return this._board ?? 
            this._hand ?? 
            this._deck ?? 
            this._graveyard; 
    }

    @asRoute(() => GameModel)
    private _game?: GameModel;
    public get game() {
        return this._game;
    }
    
    @asRoute(() => PlayerModel)
    private _player?: PlayerModel;
    public get player() {
        return this._player;
    }

    @asChild()
    private _cost: CostModel;
    protected consumeMana() {
        if (!this._player) return;
        const cost = this._cost.current;
        this._player.mana.consume(cost);
    }

    @asChildList()
    private _battlecries: BattlecryModel[];
    public get battlecries() {
        return [...this._battlecries];
    }

    @asChildList()
    private _deathrattles: DeathrattleModel[];
    public get deathrattles() {
        return [...this._deathrattles];
    }

    @asChild()
    protected abstract _disposer: DisposerModel;
    public get disposer() {
        return this._disposer;
    }

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