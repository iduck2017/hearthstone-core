import { Method, Model, TranxUtil } from "set-piece";
import { GameModel } from "./game";
import { PlayerModel } from "./player";
import { RoleActionModel } from "./rules/role/action";
import { RoleAttackModel } from "./rules/role/attack";
import { RoleHealthModel } from "./rules/role/health";
import { SleepModel } from "./rules/role/sleep";
import { DeckModel, GraveyardModel, BoardModel, HandModel, MinionCardModel, RoleFeaturesModel } from "..";
import { CardModel } from "./cards";
import { HeroModel } from "./heroes";

export namespace RoleModel {
    export type S = {};
    export type E = {};
    export type C = {
        readonly sleep: SleepModel;
        readonly health: RoleHealthModel;
        readonly attack: RoleAttackModel;
        readonly action: RoleActionModel;
        readonly feats: RoleFeaturesModel;
    };
    export type R = {};
}

export class RoleModel extends Model<
    RoleModel.E,
    RoleModel.S,
    RoleModel.C,
    RoleModel.R
> {
    public get chunk() {
        return {
            uuid: this.uuid,
            child: {
                sleep: this.origin.child.sleep.chunk,
                health: this.origin.child.health.chunk,
                attack: this.origin.child.attack.chunk,
                action: this.origin.child.action.chunk,
                feats: this.origin.child.feats.chunk,
            }
        }
    }

    public get route() {
        const result = super.route;
        const card: CardModel | undefined = result.list.find(item => item instanceof CardModel);
        const minion: MinionCardModel | undefined = result.list.find(item => item instanceof MinionCardModel);
        return {
            ...result,
            game: result.list.find(item => item instanceof GameModel),
            player: result.list.find(item => item instanceof PlayerModel),
            hero: result.list.find(item => item instanceof HeroModel),
            card,
            minion,
            board: result.list.find(item => item instanceof BoardModel),
            deck: result.list.find(item => item instanceof DeckModel),
            graveyard: result.list.find(item => item instanceof GraveyardModel),
            hand: result.list.find(item => item instanceof HandModel),
        }
    }

    public get name(): string {
        return String(this.route.card?.name ?? this.route.player?.name);
    }

    public constructor(props: RoleModel['props'] & {
        child: Pick<RoleModel.C, 'health' | 'attack'>;
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { 
                sleep: props.child.sleep ?? new SleepModel(),
                action: props.child.action ?? new RoleActionModel(),
                feats: props.child.feats ?? new RoleFeaturesModel(),
                ...props.child,
            },
            refer: { ...props.refer }
        })
    }
}