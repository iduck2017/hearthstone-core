import { Model } from "set-piece";
import { CardModel } from "./card";

export namespace ExtensionModel {
    export type State = {};
    export type Event = {};
    export type Child = {
        readonly cards: CardModel[];
    };
    export type Refer = {};
}

export abstract class ExtensionModel extends Model<
    ExtensionModel.Event,
    ExtensionModel.State,
    ExtensionModel.Child,
    ExtensionModel.Refer
> {
    constructor(props: ExtensionModel['props'] & {
        uuid: string | undefined;
        child: ExtensionModel.Child;
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}