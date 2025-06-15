import { ExtensionModel } from "@/common/extension";
import { WispCardModel } from "./card/wisp/card";
import { Props } from "set-piece";
import { MageHeroModel } from "./hero/mage/hero";

export namespace ClassicExtensionModel {
    export type Event = Partial<ExtensionModel.Event>;
    export type State = Partial<ExtensionModel.State>;
    export type Child = Partial<ExtensionModel.Child>;
    export type Refer = Partial<ExtensionModel.Refer>;
}

export class ClassicExtensionModel extends ExtensionModel {
    constructor(props: Props<
        ClassicExtensionModel.State,
        ClassicExtensionModel.Child,
        ClassicExtensionModel.Refer
    >) {
        super({
            uuid: props.uuid,
            state: {
                ...props.state,
            },
            child: {
                cards: [
                    new WispCardModel({}),
                ],
                heros: [
                    new MageHeroModel({}),
                ],
                ...props.child,
            },
            refer: {
                ...props.refer,
            },
        });
    }
}