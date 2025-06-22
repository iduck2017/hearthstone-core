import { Model } from "set-piece";
import { FeatureModel } from ".";
import { CardModel } from "../card";
import { Selector } from "@/utils/selector";
import { RootModel } from "../root";
import { PlayerModel } from "../player";
import { GameModel } from "../game";

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

    public get route(): Readonly<{
        parent: P | undefined;
        root: RootModel | undefined;
        game: GameModel | undefined;
        owner: PlayerModel | undefined;
        opponent: PlayerModel | undefined;
    }> {
        const route = super.route;
        const root = route.root instanceof RootModel ? route.root : undefined;
        return {
            root,
            parent: route.parent,
            game: root?.child.game,
            owner: route.parent?.route.owner,
            opponent: route.parent?.route.opponent,
        }
    }

    public abstract prepare(): Selector | undefined;
    
    public abstract run(...options: any[]): void;
}