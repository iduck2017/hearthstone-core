import { asChild, asTransaction, Model } from "set-piece";
import { BoardModel } from "./board";
import { HandModel } from "./hand";
import { DeckModel } from "./deck";
import { GraveyardModel } from "./graveyard";
import { ManaModel } from "../rules/mana";
import { Controller } from "../utils/controller";

export class PlayerModel extends Model {
    private _controller: Controller
    public get controller() {
        return this._controller;
    }

    @asChild()
    private _board: BoardModel;
    public get board() {
        return this._board;
    }

    @asChild()
    private _hand: HandModel;
    public get hand() {
        return this._hand;
    }

    @asChild()
    private _deck: DeckModel;
    public get deck() {
        return this._deck;
    }

    @asChild()
    private _mana: ManaModel;
    public get mana() {
        return this._mana;
    }

    @asChild()
    private _graveyard: GraveyardModel;
    public get graveyard() {
        return this._graveyard;
    }

    constructor(props?: {
        board?: BoardModel;
        hand?: HandModel;
        deck?: DeckModel;
        graveyard?: GraveyardModel;
        mana?: ManaModel;
    }) {
        super();
        this._board = props?.board ?? new BoardModel();
        this._hand = props?.hand ?? new HandModel();
        this._deck = props?.deck ?? new DeckModel();
        this._graveyard = props?.graveyard ?? new GraveyardModel();
        this._mana = props?.mana ?? new ManaModel();
        this._controller = new Controller();
    }

    @asTransaction()
    gainInitialCards(isFirstPlayer: boolean) {
        const count = isFirstPlayer ? 3 : 4;
        const cards = this.deck.cards.slice(0, count);
        this._deck.delCards(cards);
        this._hand.addCards(cards);
    }
}