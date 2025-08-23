import { Model } from "set-piece";
import { RoleModel } from "../role";
import { PlayerModel } from "../player";
import { GameModel } from "../game";
import { SkillModel } from "./skill";
import { AnchorModel } from "../..";

export namespace HeroModel {
    export type State = {
        armor: number;
    };
    export type Event = {};
    export type Child = {
        role: RoleModel;
        skill: SkillModel;
        anchor: AnchorModel;
    };
    export type Refer = {};
}

export abstract class HeroModel<
    E extends Partial<HeroModel.Event> & Model.Event = {},
    S extends Partial<HeroModel.State> & Model.State = {},
    C extends Partial<HeroModel.Child> & Model.Child = {},
    R extends Partial<HeroModel.Refer> & Model.Refer = {}
> extends Model<
    E & HeroModel.Event,
    S & HeroModel.State,
    C & HeroModel.Child,
    R & HeroModel.Refer
> {
    public get route() {
        const route = super.route;
        return { 
            ...route,
            game: route.path.find(item => item instanceof GameModel),
            player: route.path.find(item => item instanceof PlayerModel),
        }
    }

    constructor(props: HeroModel['props'] & {
        uuid: string | undefined;
        state: S;
        child: C & Pick<HeroModel.Child, 'role' | 'skill'>;
        refer: R;
    }) {
        super({ 
            uuid: props.uuid,
            state: { 
                armor: 0,
                ...props.state,
            },
            child: { 
                anchor: new AnchorModel({}),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
}