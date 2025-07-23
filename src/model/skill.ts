import { Constructor, Model } from "set-piece";
import { HeroModel } from "./hero";

export namespace SkillModel {
    export type Route = {
        hero: HeroModel
    }
    export type Event = {};
    export type State = {};
    export type Child = {};
    export type Refer = {};
}

export abstract class SkillModel<
    P extends SkillModel.Route & Model.Route = SkillModel.Route,
    E extends Partial<SkillModel.Event> & Model.Event = {},
    S extends Partial<SkillModel.State> & Model.State = {},
    C extends Partial<SkillModel.Child> & Model.Child = {},
    R extends Partial<SkillModel.Refer> & Model.Refer = {},
> extends Model<
    P & SkillModel.Route,
    E & SkillModel.Event,
    S & SkillModel.State,
    C & SkillModel.Child,
    R & SkillModel.Refer
> {
    constructor(props: SkillModel['props'] & {
        uuid: string | undefined;
        state: S;
        child: C;
        refer: R;
        route: { [K in keyof P]: [number, Constructor<P[K]>]; };
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
            route: { 
                ...props.route,
                hero: [1, HeroModel],
            }
        });
    }
}