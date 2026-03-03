import { asChild, asChildList, asRoute, Model } from "set-piece";
import { PlayerModel } from "./player";
import { BoardModel } from "./board";
import { HandModel } from "./hand";
import { DeckModel } from "./deck";
import { BattlecryModel } from "../hooks/battlecry";
import { CostModel } from "../rules/cost";
import { GameModel } from "./game";
import { DeathrattleModel } from "../hooks/deathrattle";

export interface CardProps {
    cost: CostModel;
    battlecries?: BattlecryModel[];
}

export abstract class CardModel extends Model {
    constructor(props: CardProps) {
        super();
        this._cost = props?.cost ?? new CostModel();
        this._battlecries = props?.battlecries ?? [];
    }

    @asRoute(() => BoardModel)
    private _board?: BoardModel;
    public get board() {
        return this._board;
    }

    @asRoute(() => HandModel)
    private _hand?: HandModel;
    public get hand() {
        return this._hand;
    }

    @asRoute(() => DeckModel)
    private _deck?: DeckModel;
    public get deck() {
        return this._deck;
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
    private _battlecries: BattlecryModel[] = [];
    public get battlecries() {
        return [...this._battlecries];
    }

    @asChildList()
    private _deathrattles: DeathrattleModel[] = [];
    public get deathrattles() {
        return [...this._deathrattles];
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
    
    abstract isDisposable: boolean;
    public abstract dispose(): void;
    public handleDisposed(): void {
        this._deathrattles.forEach(hook => hook.run())
    }

    public abstract play(): Promise<void>;


}