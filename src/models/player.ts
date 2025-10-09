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
import { CommandUtil } from "../utils/command";
import { SelectUtil } from "../utils/select";

export enum RoleType {
    USER = 'user',
    AGENT = 'agent',
}

export namespace PlayerProps {
    export type S = {
        readonly role: RoleType;
    };
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

    public get name() { 
        const game = this.route.game;
        const playerA = game?.child.playerA;
        const playerB = game?.child.playerB;
        if (playerA === this) return 'Player A';
        if (playerB === this) return 'Player B';
        return 'Player';
    }

    public get command(): CommandUtil[] {
        const result: CommandUtil[] = [];
        const game = this.route.game;
        if (!game) return result;
        if (SelectUtil.current?.options) {
            SelectUtil.current.options.forEach(item => {
                result.push(new CommandUtil(`Select ${String(item)}`, () => SelectUtil.set(item)));
            });
            result.push(new CommandUtil('Cancel', () => SelectUtil.set(undefined)));
            return result;
        } else {
            // base
            result.push(new CommandUtil('End Turn', () => game.child.turn.next()));
            // play
            const cards = this.child.hand.refer.order;
            cards.forEach(item => {
                if (!item.status) return;
                result.push(new CommandUtil(`Play ${item.name}`, () => item.play()));
            });
            // act
            const roles = this.query();
            roles.forEach(item => {
                const action = item.child.action;
                if (!action.status) return;
                result.push(new CommandUtil(`Act ${item.name}`, () => action.run()));
            });
            return result;
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
                state: { 
                    role: RoleType.USER,
                    ...props.state 
                },
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

    public del(feature: FeatureModel) {
        const index = this.child.feats.indexOf(feature);
        if (index == -1) return;
        this.draft.child.feats.splice(index, 1);
    }

    public query(isMinion?: boolean): RoleModel[] {
        const minions = this.child.board.child.minions.filter(item => !item.child.dispose.status);
        const roles = minions.map(item => item.child.role);
        if (isMinion) return roles;
        return [this.child.hero.child.role, ...roles];
    }


}



