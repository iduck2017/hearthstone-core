import { Model } from "set-piece";
import { FeatureModel } from ".";
import { CardModel } from "../card";
import { GameQuery } from "@/types/query";

export namespace BattlecryModel {
    export type Event = {};
    export type State = {};
    export type Child = {};
    export type Refer = {};
}

export abstract class BattlecryModel<
    P extends CardModel = CardModel,
    E extends Model.Event = {},
    S extends Model.State = {},
    C extends Model.Child = {},
    R extends Model.Refer = {}
> extends FeatureModel<
    P, 
    E & BattlecryModel.Event, 
    S & BattlecryModel.State, 
    C & BattlecryModel.Child, 
    R & BattlecryModel.Refer
> {
    constructor(props: BattlecryModel['props'] & {
        state: S & FeatureModel.State;
        child: C;
        refer: R;
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public abstract prepare(): GameQuery | undefined;
    
    public abstract run(): void;
}