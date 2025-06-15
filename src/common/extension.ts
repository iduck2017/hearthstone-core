import { Model, Props } from "set-piece";
import { CardModel } from "./card";
import { MageRoleModel } from "../extension/classic/hero/mage/role";
import { HeroModel } from "./hero";

export namespace ExtensionModel {
    export type State = {};
    export type Event = {};
    export type Child = {
        readonly cards: CardModel[];
        readonly heros: HeroModel[];
    };
    export type Refer = {};
}

export abstract class ExtensionModel extends Model<
    never,
    ExtensionModel.Event,
    ExtensionModel.State,
    ExtensionModel.Child,
    ExtensionModel.Refer
> {
    constructor(props: Props<
        ExtensionModel.State,
        ExtensionModel.Child,
        ExtensionModel.Refer
    > & {
        child: {
            cards: CardModel[];
            heros: HeroModel[];
        };
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}