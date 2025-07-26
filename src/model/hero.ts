import { Model } from "set-piece";
import { RoleModel } from "./role";
import { DamageModel } from "./damage";
import { SkillModel } from "./skill";
import { PlayerModel } from "./player";
import { RootModel } from "./root";

export namespace HeroModel {
    export type State = {
        armor: number;
    };
    export type Event = {
    };
    export type Child = {
        role: RoleModel;
        skill: SkillModel;
        damage: DamageModel;
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
                damage: new DamageModel({}),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }


    public get route(): Model['route'] & Readonly<Partial<{
        owner: PlayerModel;
    }>> {
        const { root, parent } = super.route;
        const owner = parent instanceof PlayerModel ? parent : undefined;
        return {
            root,
            owner,
            parent
        }
    }
}