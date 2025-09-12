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
import { FeaturesModel } from "./features/features";
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
        readonly feats: FeaturesModel;
    };
    export type R = {};
}

export class RoleModel extends Model<
    RoleProps.E,
    RoleProps.S,
    RoleProps.C,
    RoleProps.R
> {
    public get route() {
        const route = super.route;
        const hero: HeroModel | undefined = route.order.find(item => item instanceof HeroModel);
        const card: CardModel | undefined = route.order.find(item => item instanceof CardModel);
        const minion: MinionCardModel | undefined = route.order.find(item => item instanceof MinionCardModel);
        return {
            ...super.route, 
            card, 
            hero,
            game: route.order.find(item => item instanceof GameModel),
            player: route.order.find(item => item instanceof PlayerModel),
            minion,
            /** current position */
            hand: route.order.find(item => item instanceof HandModel),
            deck: route.order.find(item => item instanceof DeckModel),
            board: route.order.find(item => item instanceof BoardModel),
            graveyard: route.order.find(item => item instanceof GraveyardModel),
        };
    }

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
                    feats: props.child.feats ?? new FeaturesModel(),
                    ...props.child,
                },
                refer: { ...props.refer },
            }
        })
    }
}