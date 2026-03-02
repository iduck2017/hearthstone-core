import { asChild, asChildList, asRoute, Model } from "set-piece";
import { PlayerModel } from "./player";
import { BoardModel } from "./board";
import { HandModel } from "./hand";
import { DeckModel } from "./deck";
import { BattlecryModel } from "../hooks/battlecry";
import { CostModel } from "../rules/cost";
import { GameModel } from "./game";

export abstract class CardModel extends Model {
    abstract isDisposable: boolean;
    
    @asRoute(() => BoardModel)
    protected _board?: BoardModel;

    @asRoute(() => HandModel)
    protected _hand?: HandModel;

    @asRoute(() => DeckModel)
    protected _deck?: DeckModel;

    @asRoute(() => GameModel)
    protected _game?: GameModel;
    
    @asRoute(() => PlayerModel)
    private _player?: PlayerModel;
    public get player() {
        return this._player;
    }

    @asChild()
    private _cost: CostModel;

    @asChildList()
    private _battlecries?: BattlecryModel[];

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
    

    public abstract dispose(): void;

    public abstract play(): Promise<void>;

    constructor(props?: {
        cost?: CostModel;
        battlecries?: BattlecryModel[];
    }) {
        super();
        this._cost = props?.cost ?? new CostModel();
        this._battlecries = props?.battlecries ?? [];
    }

    protected consumeMana() {
        if (!this._player) return;
        const cost = this._cost.current;
        this._player.mana.consume(cost);
    }
}