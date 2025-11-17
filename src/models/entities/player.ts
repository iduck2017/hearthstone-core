import { Model } from "set-piece";
import { GameModel } from "./game";
import { HandModel } from "./hand";
import { BoardModel } from "./board";
import { DeckModel } from "./deck";
import { GraveyardModel } from "./graveyard";
import { ManaModel } from "../features/rules/mana";
import { HeroModel, RoleModel } from "./heroes";
import { FeatureModel } from "../features";
import { MageModel } from "./heroes/mage";
import { CollectionModel } from "./collection";
import { ControllerModel } from "../common/controller";
import { MinionCardModel } from "./cards/minion";
import { StartTurnHookModel } from "../features/hooks/start-turn";
import { EndTurnHookModel } from "../features/hooks/end-turn";
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
        // controller
        readonly controller: ControllerModel;
        // hooks
        readonly startTurn: StartTurnHookModel[];
        readonly endTurn: EndTurnHookModel[];
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

    public get refer() {
        const child = this.child;
        const minions: MinionCardModel[] = child.board.refer.minions.filter(item => !item.child.dispose?.status);
        const roles: RoleModel[] = [child.hero, ...minions];
        const cards: CardModel[] = [
            ...child.hand.child.cards,
            ...child.deck.child.cards,
            ...child.board.child.cards,
            ...child.board.child.secrets
        ]
        if (child.hero.child.weapon) cards.push(child.hero.child.weapon);
        return { 
            ...super.refer, 
            opponent: this.opponent, 
            roles,
            minions,
            cards,
        }
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
                controller: child.controller ?? new ControllerModel(),
                startTurn: child.startTurn ?? [],
                endTurn: child.endTurn ?? [],
                ...child
            },
            refer: { ...props.refer },
        });
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



