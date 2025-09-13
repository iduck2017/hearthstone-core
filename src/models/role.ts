import { Method, Model } from "set-piece";
import { GameModel } from "./game";
import { PlayerModel } from "./player";
import { BoardModel } from "./containers/board";
import { HandModel } from "./containers/hand";
import { DeckModel } from "./containers/deck";
import { GraveyardModel } from "./containers/graveyard";
import { MinionCardModel } from "..";
import { RoleActionModel } from "./rules/action/role";
import { RoleAttackModel } from "./rules/attack/role";
import { HealthModel } from "./rules/health";
import { SleepModel } from "./rules/sleep";
import { RoleFeatureModel } from "./features/role";
import { RoleEntriesModel } from "./entries/role";
import { CardModel } from "./cards";
import { HeroModel } from "./heroes";

export namespace RoleProps {
    export type S = {};
    export type E = {};
    export type C = {
        readonly sleep: SleepModel;
        readonly health: HealthModel;
        readonly attack: RoleAttackModel;
        readonly action: RoleActionModel;
        readonly entries: RoleEntriesModel;
        readonly feats: RoleFeatureModel[];
    };
    export type R = {};
    export type P = {
        game: GameModel;
        player: PlayerModel;
        hero: HeroModel;
        card: CardModel;
        minion: MinionCardModel;
        hand: HandModel;
        deck: DeckModel;
        board: BoardModel;
        graveyard: GraveyardModel;
    }
}

export class RoleModel extends Model<
    RoleProps.E,
    RoleProps.S,
    RoleProps.C,
    RoleProps.R,
    RoleProps.P
> {
    public get state() {
        const state = super.state;
        return {
            ...state,
            health: this.child.health.state.current,
            attack: this.child.attack.state.current,
            action: this.child.action.state.current,
        }
    }

    public constructor(loader: Method<RoleModel['props'] & {
        child: Pick<RoleProps.C, 'health' | 'attack'>;
    }, []>) {
        super(() => {
            const props = loader();
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: { 
                    sleep: props.child.sleep ?? new SleepModel(),
                    action: props.child.action ?? new RoleActionModel(),
                    entries: props.child.entries ?? new RoleEntriesModel(),
                    feats: [],
                    ...props.child,
                },
                refer: { ...props.refer },
                route: {
                    game: GameModel.prototype,
                    player: PlayerModel.prototype,
                    hero: HeroModel.prototype,
                    card: CardModel.prototype,
                    minion: MinionCardModel.prototype,
                    hand: HandModel.prototype,
                    deck: DeckModel.prototype,
                    board: BoardModel.prototype,
                    graveyard: GraveyardModel.prototype,
                },
            }
        })
    }

    public add(feature: RoleFeatureModel) {
        this.draft.child.feats.push(feature);
    }
}