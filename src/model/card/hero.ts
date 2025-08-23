import { Model } from "set-piece";
import { CardModel, SkillModel } from "../..";

export namespace HeroModel {
    export type Event = Partial<CardModel.Event> & {};
    export type State = Partial<CardModel.State> & {
        armor: number;
    };
    export type Child = Partial<CardModel.Child> & {
        skill: SkillModel
    };
    export type Refer = Partial<CardModel.Refer>;
}

export abstract class HeroModel<
    E extends Partial<HeroModel.Event> & Model.Event = {},
    S extends Partial<HeroModel.State> & Model.State = {},
    C extends Partial<HeroModel.Child> & Model.Child = {},
    R extends Partial<HeroModel.Refer> & Model.Refer = {}
> extends CardModel<
    E & HeroModel.Event,
    S & HeroModel.State,
    C & HeroModel.Child,
    R & HeroModel.Refer
> {
    constructor(props: HeroModel['props'] & {
        uuid: string | undefined;
        state: S & 
            Pick<HeroModel.State, 'armor'> & 
            CardModel.State, 
        child: C & 
            Pick<HeroModel.Child, 'skill'> & 
            Pick<CardModel.Child, 'cost'>,
        refer: R
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}