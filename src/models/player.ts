import { Method, Model } from "set-piece";
import { GameModel } from "./game";
import { HandModel } from "./containers/hand";
import { BoardModel } from "./containers/board";
import { DeckModel } from "./containers/deck";
import { GraveyardModel } from "./containers/graveyard";
import { ManaModel } from "./rules/mana";
import { CharacterModel } from "./characters";
import { RoleModel } from "./role";

export namespace PlayerProps {
    export type S= {};
    export type E = {
    };
    export type C = {
        readonly character: CharacterModel;
        readonly mana: ManaModel;
        // container
        readonly hand: HandModel;
        readonly deck: DeckModel;
        readonly board: BoardModel;
        readonly graveyard: GraveyardModel;
    };
    export type R = {}
}

export class PlayerModel extends Model<
    PlayerProps.E, 
    PlayerProps.S, 
    PlayerProps.C, 
    PlayerProps.R
> {
    public get route() {
        const route = super.route;
        return { 
            ...route,
            game: route.order.find(item => item instanceof GameModel),
        }
    }

    public get refer() {
        let roles: RoleModel[] = [];
        roles.push(this.child.character.child.role);
        roles.push(...this.child.board.child.minions.map(item => item.child.role));
        roles = roles.filter(item => item.child.death.state)
        return { 
            ...super.refer, 
            roles,
            opponent: this.opponent, 
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
        child: Pick<PlayerProps.C, 'character'>;
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
            }
        });
    }

    public check(): boolean {
        const game = this.route.game;
        if (!game) return false;
        const turn = game.child.turn;
        if (turn.refer.current !== this) return false;
        return true;
    }
}



