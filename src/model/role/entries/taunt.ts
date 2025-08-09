import { Model } from "set-piece";

export namespace TauntModel {
    export type State = {
        readonly name: string;
        readonly desc: string;
        isActive: boolean;
    };
    export type Event = {};
    export type Child = {};
    export type Refer = {};
}

export class TauntModel extends Model<
    TauntModel.Event,
    TauntModel.State,
    TauntModel.Child,
    TauntModel.Refer
> {
    constructor(props: TauntModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: "Taunt",
                desc: "Enemies must attack this minion.",
                isActive: false,
            },
            child: {},
            refer: {},
        });
    }
}