import { Model } from "set-piece";
import { GameModel } from "../game";
import { HandModel } from "../containers/hand";
import { BoardModel } from "../containers/board";
import { DeckModel } from "../containers/deck";
import { GraveyardModel } from "../containers/graveyard";
import { RoleModel } from "../role";
import { SkillModel } from "../skills";
import { AnchorModel } from "../rules/anchor";
import { ArmorModel } from "../rules/armor";
import { MinionModel } from "../cards/minion";
import { ManaModel } from "../rules/mana";
import { CardModel } from "../cards";

export namespace PlayerModel {
    export type State = {};
    export type Event = {
    };
    export type Child = {
        readonly role: RoleModel;
        readonly mana: ManaModel;
        readonly armor: ArmorModel;
        readonly skill: SkillModel;
        readonly anchor: AnchorModel;
        weapon?: CardModel;

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
        const board = this.child.board;
        const minions: MinionModel[] = [];
        board.child.cards.forEach(item => item.child.minion && minions.push(item.child.minion));
        return { 
            ...super.refer, 
            opponent: this.opponent, 
            minions, 
            roles: [ ...minions, this.child.role ],
        }
    }

    private get opponent(): PlayerModel | undefined {
        const game = this.route.game;
        if (!game) return;
        const playerA = game?.child.playerA;
        const playerB = game?.child.playerB;
        return playerA === this ? playerB : playerA;
    }

    constructor(props: PlayerModel['props'] & {
        child: Pick<PlayerModel.Child, 'role' | 'skill'>;
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: {
                mana: new ManaModel({}),
                armor: new ArmorModel({}),
                anchor: new AnchorModel({}),

                hand: new HandModel({}),
                deck: new DeckModel({}),
                board: new BoardModel({}),
                graveyard: new GraveyardModel({}),
                ...props.child
            },
            refer: { ...props.refer },
        });
    }

    equip(card: CardModel) {
        if (!card.child.weapon) return;
        const current = this.draft.child.weapon;
        if (current) current.clear();
        
    }
}



