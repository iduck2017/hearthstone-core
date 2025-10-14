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
import { Option } from "../types/option";
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
            state: this.state,
            child: {
                hero: this.origin.child.hero.chunk,
                mana: this.origin.child.mana.chunk,
                hand: this.origin.child.hand.chunk,
                deck: this.origin.child.deck.chunk,
                board: this.origin.child.board.chunk,
                graveyard: this.origin.child.graveyard.chunk,
                feats: this.origin.child.feats.map(item => item.chunk).filter(Boolean),
            }
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

    public get options(): Option[] {
        const result: Option[] = [];
        const game = this.route.game;
        if (!game) return result;
        if (SelectUtil.current?.options) {
            result.push(...SelectUtil.current.options.map(item => {
                const name = item instanceof Model ? item.name : String(item);
                const uuid = item instanceof Model ? item.uuid : String(item);
                // return option
                return new Option(`Select ${name}`,  `select-${uuid}`, () => SelectUtil.set(item))
            }));
            result.push(new Option('Cancel', 'cancel', () => SelectUtil.set(undefined)));
            return result;
        } else {
            // base
            result.push(new Option('End Turn', 'end-turn', () => game.child.turn.next()));
            // play
            const cards = this.child.hand.refer.queue;
            cards?.forEach(item => {
                if (!item.status) return;
                result.push(new Option(`Play ${item.name}`, `play-${item.uuid}`, () => item.play()));
            });
            // act
            const roles = this.query();
            roles.forEach(item => {
                const action = item.child.action;
                if (!action.status) return;
                result.push(new Option(`Act ${item.name}`, `act-${item.uuid}`, () => action.run()));
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



