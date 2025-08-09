import { Model } from "set-piece";
import { DeathrattleModel } from "./deathrattle";
import { BattlecryModel } from "./battlecry";

export namespace CardHooksModel {
    export type State = {};
    export type Event = {};
    export type Child = {
        readonly battlecry: BattlecryModel[];
        readonly deathrattle: DeathrattleModel[];
    };
    export type Refer = {};
}

export class CardHooksModel extends Model<
    CardHooksModel.Event,
    CardHooksModel.State,
    CardHooksModel.Child,
    CardHooksModel.Refer
> {
    constructor(props: CardHooksModel['props']) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: {
                battlecry: [],
                deathrattle: [],
                ...props.child,
            },
            refer: { ...props.refer },
        })
    }
}