import { Model } from "set-piece";
import { GameModel } from "./game";
import { HandModel } from "./containers/hand";
import { BoardModel } from "./containers/board";
import { DeckModel } from "./containers/deck";
import { GraveyardModel } from "./containers/graveyard";
import { ManaModel } from "../rules/mana";
import { HeroModel, RoleModel } from "./heroes";
import { FeatureModel } from "../features";
import { MageModel } from "./heroes/mage";
import { CollectionModel } from "./containers/collection";
import { Controller } from "../../types/controller";
import { MinionCardModel } from "./cards/minion";
import { TurnStartModel } from "../features/hooks/turn-start";
import { TurnEndModel } from "../features/hooks/turn-end";
import { CardModel } from "./cards";

export enum PlayerType {
    USER = 'user',
    AGENT = 'agent',
}

export namespace PlayerModel {
    export type S = {
        readonly role: PlayerType;
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
        readonly collection: CollectionModel;
        // buff
        readonly feats: FeatureModel[];
        // hooks
        readonly turnStart: TurnStartModel[];
        readonly turnEnd: TurnEndModel[];
    };
    export type R = {}
}

export class PlayerModel extends Model<
    PlayerModel.E, 
    PlayerModel.S, 
    PlayerModel.C, 
    PlayerModel.R
> {
    public get route() {
        const result = super.route;
        return {
            ...result,
            game: result.items.find(item => item instanceof GameModel),
        }
    }

    public get refer(): PlayerModel.R & {
        readonly opponent?: PlayerModel;
        readonly minions: MinionCardModel[];
        readonly roles: RoleModel[];
        readonly cards: CardModel[];
    } {
        return { 
            ...super.refer, 
            cards: this.cards,
            roles: this.roles,
            minions: this.minions,
            opponent: this.opponent, 
        }
    }

    protected get cards(): CardModel[] {
        const hand = this.child.hand;
        const deck = this.child.deck;
        const board = this.child.board;
        const cards: CardModel[] = [
            ...hand.child.cards, 
            ...deck.child.cards, 
            ...board.child.cards, 
            ...board.child.secrets,
        ];
        const weapon = this.child.hero.child.weapon;
        if (weapon) cards.push(weapon);
        return cards;
    }

    protected get roles(): RoleModel[] {
        const minions = this.minions;
        const hero = this.child.hero;
        const roles: RoleModel[] = [hero, ...minions];
        return roles;
    }

    protected get minions(): MinionCardModel[] {
        const child = this.child;
        const minions: MinionCardModel[] = child.board.refer.minions.filter(item => (
            !item.child.dispose?.state.isActived
        ));
        return minions;
    }


    protected get opponent(): PlayerModel | undefined {
        const game = this.route.game;
        const playerA = game?.child.playerA;
        const playerB = game?.child.playerB;
        const opponent = playerA === this ? playerB : playerA;
        return opponent;
    }


    public get state() {
        const result = super.state;
        return {
            ...result,
            isCurrent: this.isCurrent,
        }
    }

    protected get isCurrent(): boolean {
        const game = this.route.game;
        const turn = game?.child.turn;
        const isCurrent = turn?.refer.current === this;
        return isCurrent;
    }

    public get chunk() {
        const feats = this.child.feats.map(item => item.chunk).filter(Boolean);
        return {
            attack: this.child.hero.child.attack.chunk,
            health: this.child.hero.child.health.chunk,
            action: this.child.hero.child.action.chunk,
            armor: this.child.hero.child.armor.state.current,
            skill: this.child.hero.child.skill.chunk,
            mana: this.child.mana.chunk,
            hand: this.child.hand.chunk,
            deck: this.child.deck.chunk,
            board: this.child.board.chunk,
            feats: feats.length ? feats : undefined,
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

    public readonly controller: Controller;

    constructor(props?: PlayerModel['props']) {
        props = props ?? {};
        const child = props?.child ?? {};
        super({
            uuid: props.uuid,
            state: { 
                role: PlayerType.USER,
                ...props.state 
            },
            child: {
                feats: [],
                hero: child.hero ?? new MageModel(),
                mana: child.mana ?? new ManaModel(),
                hand: child.hand ?? new HandModel(),
                deck: child.deck ?? new DeckModel(),
                board: child.board ?? new BoardModel(),
                collection: child.collection ?? new CollectionModel(),
                graveyard: child.graveyard ?? new GraveyardModel(),
                turnStart: child.turnStart ?? [],
                turnEnd: child.turnEnd ?? [],
                ...child
            },
            refer: { ...props.refer },
        });
        this.controller = new Controller(this);
    }

    public buff(feature: FeatureModel) {
        this.origin.child.feats.push(feature);
    }

    public debuff(feature: FeatureModel) {
        const index = this.child.feats.indexOf(feature);
        if (index == -1) return;
        this.origin.child.feats.splice(index, 1);
    }
}



