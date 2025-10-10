import { Method, Model, TranxUtil } from "set-piece";
import { GameModel } from "./game";
import { PlayerModel } from "./player";
import { RoleActionModel } from "./rules/role-action";
import { RoleAttackModel } from "./rules/role-attack";
import { RoleHealthModel } from "./rules/health";
import { SleepModel } from "./rules/sleep";
import { RoleFeatsModel } from "..";
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
        readonly feats: RoleFeatsModel;
    };
    export type R = {};
}

export class RoleModel extends Model<
    RoleModel.E,
    RoleModel.S,
    RoleModel.C,
    RoleModel.R
> {
    public get route() {
        const result = super.route;
        return {
            ...result,
            game: result.list.find(item => item instanceof GameModel),
            player: result.list.find(item => item instanceof PlayerModel),
            hero: result.list.find(item => item instanceof HeroModel),
            card: result.list.find(item => item instanceof CardModel),
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
                feats: props.child.feats ?? new RoleFeatsModel(),
                ...props.child,
            },
            refer: { ...props.refer }
        })
    }
}