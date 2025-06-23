import { Model } from "set-piece";
import { FeatureModel } from ".";
import { CardModel } from "../card";
import { RootModel } from "../root";
import { PlayerModel } from "../player";
import { GameModel } from "../game";
import { Selector } from "@/utils/selector";

export namespace BattlecryModel {
    export type Event = Partial<FeatureModel.Event> & {
        onBattlecry: void;
    };
    export type State = Partial<FeatureModel.State> & {};
    export type Child = Partial<FeatureModel.Child> & {};
    export type Refer = Partial<FeatureModel.Refer> & {};
}

export abstract class BattlecryModel<
    T extends Model[] = Model[],
    P extends CardModel = CardModel,
    E extends Partial<BattlecryModel.Event> & Model.Event = {},
    S extends Partial<BattlecryModel.State> & Model.State = {},
    C extends Partial<BattlecryModel.Child> & Model.Child = {},
    R extends Partial<BattlecryModel.Refer> & Model.Refer = {}
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

    public get route(): Readonly<Partial<{
        parent: P;
        root: RootModel;
        game: GameModel;
        owner: PlayerModel;
        opponent: PlayerModel;
    }>> {
        const route = super.route;
        const card = route.parent;
        return {
            ...card?.route,
            parent: route.parent,
        }
    }

    public abstract prepare(): { [K in keyof T]: Selector<T[K]> } | undefined;

    public abstract run(...target: T): Promise<void>;
}