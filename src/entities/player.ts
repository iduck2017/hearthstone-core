import { useChild, useRoute, useTrx, Model } from "set-piece";
import { BoardModel } from "./board";
import { HandModel } from "./hand";
import { DeckModel } from "./deck";
import { GraveyardModel } from "./graveyard";
import { ManaModel } from "../rules/mana";
import { Controller } from "../utils/controller";
import { GameModel } from "./game";
import { HeroModel } from "./hero";

export class PlayerModel extends Model {
    constructor(props: {
        hero: HeroModel;
        board?: BoardModel;
        hand?: HandModel;
        deck?: DeckModel;
        graveyard?: GraveyardModel;
        mana?: ManaModel;
    }) {
        super();
        this._hero = props.hero;
        this._board = props?.board ?? new BoardModel();
        this._hand = props?.hand ?? new HandModel();
        this._deck = props?.deck ?? new DeckModel();
        this._graveyard = props?.graveyard ?? new GraveyardModel();
        this._mana = props?.mana ?? new ManaModel();
        this._controller = new Controller();
    }

    
    private _controller: Controller
    public get controller() {
        return this._controller;
    }

    @useRoute(() => GameModel)
    private _game?: GameModel;
    public get opponent(): PlayerModel | undefined {
        const game = this._game;
        if (!game) return;
        if (this === game.playerA) return game.playerB;
        if (this === game.playerB) return game.playerA;
        return;
    }

    @useChild()
    private _board: BoardModel;
    public get board() {
        return this._board;
    }

    @useChild()
    private _hand: HandModel;
    public get hand() {
        return this._hand;
    }

    @useChild()
    private _deck: DeckModel;
    public get deck() {
        return this._deck;
    }

    @useChild()
    private _mana: ManaModel;
    public get mana() {
        return this._mana;
    }

    @useChild()
    private _hero: HeroModel;
    public get hero() {
        return this._hero;
    }

    @useChild()
    private _graveyard: GraveyardModel;
    public get graveyard() {
        return this._graveyard;
    }

    @useTrx()
    public prepareInitialCards(isFirstPlayer: boolean) {
        const count = isFirstPlayer ? 3 : 4;
        const cards = this.deck.cards.slice(0, count);
        this._deck.removeCards(cards);
        this._hand.addCards(cards);
    }


    public drawCard() {
        const card = this.deck.cards[0];
        if (!card) return;
        this.deck.removeCard(card);
        this.hand.addCard(card);
    }


}