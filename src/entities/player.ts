import { useChild, useRoute, Model, TypedPropertyDecorator, useMemo, useAction, useModel } from "set-piece";
import { BoardModel } from "./board";
import { HandModel } from "./hand";
import { DeckModel } from "./deck";
import { GraveyardModel } from "./graveyard";
import { Controller } from "../utils/controller";
import { ManaModel } from "../rules/mana";
import { GameModel } from "./game";
import { HeroModel } from "../heroes";
import { WorkspaceModel } from "./workspace";
import { CardModel } from "../cards";

@useModel('player-model')
export class PlayerModel extends Model {
    protected _brand: symbol = Symbol('player-model');
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
        this._workspace = new WorkspaceModel();
        this._controller = new Controller();
    }

    private _controller: Controller
    @useMemo()
    public get controller() {
        return this._controller;
    }

    @useRoute(() => GameModel)
    private _game?: GameModel;
    @useMemo()
    public get opponent(): PlayerModel | undefined {
        const game = this._game;
        if (!game) return;
        if (this === game.playerA) return game.playerB;
        if (this === game.playerB) return game.playerA;
        return;
    }

    @useChild()
    private _board: BoardModel;
    @useMemo()
    public get board() {
        return this._board;
    }

    @useChild()
    private _workspace: WorkspaceModel;
    @useMemo()
    public get workspace() {
        return this._workspace;
    }

    @useChild()
    private _hand: HandModel;
    @useMemo()
    public get hand() {
        return this._hand;
    }

    @useChild()
    private _deck: DeckModel;
    @useMemo()
    public get deck() {
        return this._deck;
    }

    @useChild()
    private _mana: ManaModel;
    @useMemo()
    public get mana() {
        return this._mana;
    }

    @useChild()
    private _hero: HeroModel;
    @useMemo()
    public get hero() {
        return this._hero;
    }

    @useChild()
    private _graveyard: GraveyardModel;
    @useMemo()
    public get graveyard() {
        return this._graveyard;
    }


    @useMemo()
    public get cards(): CardModel[] {
        const result = [
            ...this._board.cards,
            ...this._graveyard.cards,
            ...this._workspace.cards,
            ...this._deck.cards,
            ...this._hand.cards,
        ];
        const weapon = this.hero.weapon;
        if (weapon) result.push(weapon);
        return result;
    }

    @useAction()
    public prepareGame(isFirstPlayer: boolean) {
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