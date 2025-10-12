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

export enum RoleType {
    USER = 'user',
    AGENT = 'agent',
}

export namespace PlayerModel {
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
        if (SelectUtil.current?.targets) {
            result.push(...SelectUtil.current.options);
            return result;
        } else {
            // base
            result.push(new Option({
                title: 'End Turn',
                code: 'end-turn',
            }, () => game.child.turn.next()));
            // play
            const cards = this.child.hand.refer.queue;
            cards?.forEach(item => {
                if (!item.status) return;
                result.push(new Option({
                    title: `Play ${item.name}`,
                    code: `play-${item.uuid}`,
                }, () => item.play()));
            });
            // act
            const roles = this.query();
            roles.forEach(item => {
                const action = item.child.action;
                if (!action.status) return;
                result.push(new Option({
                    title: `Act ${item.name}`,
                    code: `act-${item.uuid}`,
                }, () => action.run()));
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
                role: RoleType.USER,
                ...props.state 
            },
            child: {
                feats: [],
                hero: child.hero ?? new MageModel(),
                mana: child.mana ?? new ManaModel(),
                hand: child.hand ?? new HandModel(),
                deck: child.deck ?? new DeckModel(),
                board: child.board ?? new BoardModel(),
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



