import { Method, Model } from "set-piece";
import { GameModel } from "./game";
import { HandModel } from "./cards/group/hand";
import { BoardModel } from "./cards/group/board";
import { DeckModel } from "./cards/group/deck";
import { GraveyardModel } from "./cards/group/graveyard";
import { ManaModel } from "./rules/hero/mana";
import { HeroModel } from "./heroes";
import { RoleModel } from "./role";
import { FeatureModel } from "./features";
import { SelectUtil } from "../utils/select";
import { MageModel } from "./heroes/mage";
import { CollectionModel } from "./cards/group/collection";

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
        readonly feats: FeatureModel[];
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
            game: result.list.find(item => item instanceof GameModel),
        }
    }

    public get refer() {
        return { 
            ...super.refer, 
            opponent: this.opponent, 
        }
    }

    public get chunk() {
        return {
            role: this.child.hero.child.role.chunk,
            armor: this.child.hero.child.armor.state.current,
            skill: this.child.hero.child.skill.chunk,
            mana: this.child.mana.chunk,
            hand: this.child.hand.chunk,
            deck: this.child.deck.chunk,
            board: this.child.board.chunk,
            feats: this.child.feats.map(item => item.chunk).filter(Boolean),
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
                ...child
            },
            refer: { ...props.refer },
        });
    }

    public add(feature: FeatureModel) {
        this.origin.child.feats.push(feature);
    }

    public del(feature: FeatureModel) {
        const index = this.child.feats.indexOf(feature);
        if (index == -1) return;
        this.origin.child.feats.splice(index, 1);
    }

    public query(isMinion?: boolean): RoleModel[] {
        const minions = this.child.board.child.minions.filter(item => !item.child.dispose.status);
        const roles = minions.map(item => item.child.role);
        if (isMinion) return roles;
        return [this.child.hero.child.role, ...roles];
    }


}



