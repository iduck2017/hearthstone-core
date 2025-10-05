import { Method, Model, TranxUtil } from "set-piece";
import { GameModel } from "./game";
import { PlayerModel } from "./player";
import { BoardModel } from "./containers/board";
import { HandModel } from "./containers/hand";
import { DeckModel } from "./containers/deck";
import { GraveyardModel } from "./containers/graveyard";
import { FeatureModel, MinionCardModel, RoleBuffModel } from "..";
import { RoleActionModel } from "./rules/action/role";
import { RoleAttackModel } from "./rules/attack/role";
import { RoleHealthModel } from "./rules/health";
import { SleepModel } from "./rules/sleep";
import { RoleEntriesModel } from "./entries/role";
import { CardModel } from "./cards";
import { HeroModel } from "./heroes";
import { RoleHooksModel } from "./hooks/role";

export namespace RoleProps {
    export type S = {};
    export type E = {};
    export type C = {
        readonly sleep: SleepModel;
        readonly health: RoleHealthModel;
        readonly attack: RoleAttackModel;
        readonly action: RoleActionModel;
        readonly entries: RoleEntriesModel;
        readonly hooks: RoleHooksModel;
        readonly feats: FeatureModel[];
        readonly buffs: RoleBuffModel[];
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
                    hooks: props.child.hooks ?? new RoleHooksModel(),
                    feats: [],
                    buffs: [],
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

    public add(feature: FeatureModel) {
        if (feature instanceof RoleBuffModel) this.draft.child.buffs.push(feature);
        else this.draft.child.feats.push(feature);
    }

    @TranxUtil.span()
    public reset(buff: RoleBuffModel) {
        this.add(buff);
    }
}