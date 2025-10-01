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
import { FeatureModel } from "./features";

export namespace PlayerProps {
    export type S= {};
    export type E = {};
    export type C = {
        readonly hero: HeroModel;
        readonly mana: ManaModel;
        // container
        readonly hand: HandModel;
        readonly deck: DeckModel;
        readonly board: BoardModel;
        readonly graveyard: GraveyardModel;
        readonly feats: FeatureModel[];
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
        return { 
            ...super.refer, 
            opponent: this.opponent, 
        }
    }
    
    public get status(): boolean {
        const game = this.route.game;
        if (!game) return false;
        const turn = game.child.turn;
        if (turn.refer.current !== this) return false;
        return true;
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
                    feats: [],
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

    public add(feature: FeatureModel) {
        this.draft.child.feats.push(feature);
    }

    public query(isMinion?: boolean): RoleModel[] {
        const minions = this.child.board.child.minions.filter(item => !item.child.dispose.status);
        const roles = minions.map(item => item.child.role);
        if (isMinion) return roles;
        return [this.child.hero.child.role, ...roles];
    }
}



