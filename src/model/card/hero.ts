import { Model } from "set-piece";
import { CardModel } from ".";
import { SkillModel } from "../skill";
import { CardType } from "src/types/card";
import { PlayerModel } from "../player";
import { ExtensionModel } from "../extension";
import { HandModel } from "../hand";

export namespace HeroCardModel {
    export type Event = Partial<CardModel.Event> & {};
    export type State = Partial<CardModel.State> & {
        armor: number;
    };
    export type Child = Partial<CardModel.Child> & {
        skill: SkillModel
    };
    export type Refer = Partial<CardModel.Refer>;
}

export class HeroCardModel<
    E extends Partial<HeroCardModel.Event> & Model.Event = {},
    S extends Partial<HeroCardModel.State> & Model.State = {},
    C extends Partial<HeroCardModel.Child> & Model.Child = {},
    R extends Partial<HeroCardModel.Refer> & Model.Refer = {}
> extends CardModel<
    E & HeroCardModel.Event,
    S & HeroCardModel.State,
    C & HeroCardModel.Child,
    R & HeroCardModel.Refer
> {
    constructor(props: HeroCardModel['props'] & {
        uuid: string | undefined;
        state: S 
            & Pick<CardModel.State, 'name' | 'desc' | 'mana'>
            & Pick<HeroCardModel.State, 'armor'>;
        child: C & Pick<HeroCardModel.Child, 'skill'>;
        refer: R;
    }) {
        super({
            uuid: props.uuid,
            state: {
                type: CardType.HERO,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public toPlay() {
    }
}