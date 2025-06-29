import { Model } from "set-piece";
import { SkillModel } from "./skill";
import { RoleModel } from "../role";
import { PlayerModel } from "../player";
import { GameModel } from "../game";
import { RootModel } from "../root";
import { Optional } from "../../types";

export namespace HeroModel {
    export type Event = {};
    export type State = {
        readonly name: string;
    };
    export type Child = {
        readonly role: RoleModel;
        skill: SkillModel;
    };
    export type Refer = {};
}

export abstract class HeroModel<
    P extends PlayerModel = PlayerModel,
    E extends Partial<HeroModel.Event> = {},
    S extends Partial<HeroModel.State> = {},
    C extends Partial<HeroModel.Child> & Model.Child = {},
    R extends Partial<HeroModel.Refer> & Model.Refer = {}
> extends Model< 
    P,
    E & HeroModel.Event,
    S & HeroModel.State,
    C & HeroModel.Child,
    R & HeroModel.Refer
> {
    constructor(props: HeroModel['props'] & {
        state: S & HeroModel.State;
        child: C & HeroModel.Child;
        refer: R;
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public get route(): Readonly<Optional<{
        parent: P;
        root: RootModel;
        game: GameModel;
        owner: PlayerModel;
        opponent: PlayerModel;
    }>> {
        const route = super.route;
        const root = route.root instanceof RootModel ? route.root : undefined;
        const game = root?.child.game;
        const owner = route.parent;
        return {
            parent: route.parent,
            root,
            game,
            owner,
            opponent: owner?.route.opponent,
        }
    }
}