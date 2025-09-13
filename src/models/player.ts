import { Method, Model } from "set-piece";
import { GameModel } from "./game";
import { HandModel } from "./containers/hand";
import { BoardModel } from "./containers/board";
import { DeckModel } from "./containers/deck";
import { GraveyardModel } from "./containers/graveyard";
import { ManaModel } from "./rules/mana";
import { HeroModel } from "./heroes";
import { RoleModel } from "./role";
import { MinionCardModel } from "./cards/minion";

export namespace PlayerProps {
    export type S= {};
    export type E = {
    };
    export type C = {
        readonly hero: HeroModel;
        readonly mana: ManaModel;
        // container
        readonly hand: HandModel;
        readonly deck: DeckModel;
        readonly board: BoardModel;
        readonly graveyard: GraveyardModel;
    };
    export type R = {}
    export type P = {
        game: GameModel;
    }
}

export class PlayerModel extends Model<
    PlayerProps.E, 
    PlayerProps.S, 
    PlayerProps.C, 
    PlayerProps.R,
    PlayerProps.P
> {
    public get refer() {
        const minions: MinionCardModel[] = this.child.board.child.minions.filter(item => !item.child.dispose.state.isActive);
        const entities: (MinionCardModel | HeroModel)[] = [this.child.hero, ...minions].filter(item => !item.child.dispose.state.isActive);
        return { 
            ...super.refer, 
            roles: entities.map(item => item.child.role),
            minions: minions.map(item => item.child.role),
            opponent: this.opponent, 
        }
    }

    public get state() {
        const state = super.state;
        return {
            ...state,
            isActive: this.check(),
        }
    }

    private get opponent(): PlayerModel | undefined {
        const game = this.route.game;
        if (!game) return;
        const playerA = game?.child.playerA;
        const playerB = game?.child.playerB;
        return playerA === this ? playerB : playerA;
    }

    constructor(loader: Method<PlayerModel['props'] & {
        child: Pick<PlayerProps.C, 'hero'>;
    }, []>) {
        super(() => {
            const props = loader?.();
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: {
                    mana: props.child.mana ?? new ManaModel(),
                    hand: props.child.hand ?? new HandModel(),
                    deck: props.child.deck ?? new DeckModel(),
                    board: props.child.board ?? new BoardModel(),
                    graveyard: props.child.graveyard ?? new GraveyardModel(),
                    ...props.child
                },
                refer: { ...props.refer },
                route: { game: GameModel.prototype },
            }
        });
    }

    private check(): boolean {
        const game = this.route.game;
        if (!game) return false;
        const turn = game.child.turn;
        if (turn.refer.current !== this) return false;
        return true;
    }
}



