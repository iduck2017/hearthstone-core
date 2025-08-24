import { Model } from "set-piece";
import { GameModel } from "../game";
import { HandModel } from "../game/hand";
import { BoardModel } from "../game/board";
import { DeckModel } from "../game/deck";
import { GraveyardModel } from "../game/graveyard";
import { RoleModel } from "../role";
import { SkillModel } from "../skill/skill";
import { AnchorModel } from "../anchor";
import { ArmorModel } from "./armor";

export namespace PlayerModel {
    export type State = {};
    export type Event = {
    };
    export type Child = {
        readonly role: RoleModel;
        readonly armor: ArmorModel;
        readonly skill: SkillModel;
        readonly anchor: AnchorModel;
        readonly hand: HandModel;
        readonly deck: DeckModel;
        readonly board: BoardModel;
        readonly graveyard: GraveyardModel;
    };
    export type Refer = {}
}

export abstract class PlayerModel extends Model<
    PlayerModel.Event, 
    PlayerModel.State, 
    PlayerModel.Child,
    PlayerModel.Refer
> {
    public get route() {
        const route = super.route;
        return { 
            ...route,
            game: route.path.find(item => item instanceof GameModel),
        }
    }

    public get refer() {
        const game = this.route.game;
        const board = this.child.board;
        let opponent: PlayerModel | undefined;
        if (game?.child.playerA === this) opponent = game.child.playerB;
        if (game?.child.playerB === this) opponent = game.child.playerA;
        const minions: RoleModel[] = [];
        board.child.cards.forEach(item => {
            if (item.child.minion) minions.push(item.child.minion);
        })
        return { 
            ...super.refer, 
            opponent, 
            minions, 
            roles: [ ...minions, this.child.role ],
        }
    }

    constructor(props: PlayerModel['props'] & {
        child: Pick<PlayerModel.Child, 'role' | 'skill'>;
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: {
                armor: new ArmorModel({}),
                hand: new HandModel({}),
                deck: new DeckModel({}),
                board: new BoardModel({}),
                anchor: new AnchorModel({}),
                graveyard: new GraveyardModel({}),
                ...props.child
            },
            refer: { ...props.refer },
        });
    }
}



