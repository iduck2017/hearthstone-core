import { asChildList, asState, Model } from "set-piece";
import { PlayerModel } from "./player";



export class GameModel extends Model {
    @asChildList()
    private _players: [PlayerModel, PlayerModel];
    public get players(): [PlayerModel, PlayerModel] {
        return [...this._players];
    }
    public get currentPlayer() {
        return this._players[this._turn % 2 ? 0 : 1];
    }
    
    @asState()
    private _isStarted: boolean = false;
    public get isStarted() {
        return this._isStarted;
    }

    @asState()
    private _turn: number = 0;
    public nextTurn() {
        this.endTurn();
        this._turn += 1;
        this.startTurn();
    }
    private endTurn() {
    }
    private startTurn() {
        const currentPlayer = this.currentPlayer;
        currentPlayer.mana.addMaximum(1);
        currentPlayer.mana.reset();
    }

    public start() {
        if (this._isStarted) {
            console.error('Game already started');
            return;
        }
        this._isStarted = true;
        this._players.forEach((player) => {
            const isFirstPlayer = player === this._players[0];
            player.gainInitialCards(isFirstPlayer);
        });
        this.nextTurn();
    }

    constructor(props?: {
        players?: [PlayerModel, PlayerModel];
    }) {
        super();
        this._players = props?.players ?? [
            new PlayerModel(),
            new PlayerModel(),
        ];
    }
}