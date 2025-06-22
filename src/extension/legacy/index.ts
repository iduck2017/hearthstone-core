import { ExtensionModel } from "@/common/extension";
import { WispCardModel } from "./wisp/card";

export namespace LegacyExtensionModel {
    export type Event = Partial<ExtensionModel.Event>;
    export type State = Partial<ExtensionModel.State>;
    export type Child = Partial<ExtensionModel.Child>;
    export type Refer = Partial<ExtensionModel.Refer>;
}

export class LegacyExtensionModel extends ExtensionModel {
    constructor(props: LegacyExtensionModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                ...props.state,
            },
            child: {
                cards: [
                    new WispCardModel({}),
                ],
                ...props.child,
            },
            refer: {
                ...props.refer,
            },
        });
    }
}