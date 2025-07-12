import { EventUtil, Model } from "set-piece";
import { FeatureModel } from ".";
import { CardModel } from "../card";
import { RootModel } from "../root";
import { PlayerModel } from "../player";
import { GameModel } from "../game";
import { Selector } from "../../utils/selector";
import { Optional } from "set-piece";

export namespace BattlecryModel {
    export type Event = Partial<FeatureModel.Event> & {
        battlecry: {};
    };
    export type State = Partial<FeatureModel.State> & {};
    export type Child = Partial<FeatureModel.Child> & {};
    export type Refer = Partial<FeatureModel.Refer> & {};
}

export abstract class BattlecryModel<
    T extends Model[] = Model[],
    E extends Partial<BattlecryModel.Event> & Model.Event = {},
    S extends Partial<BattlecryModel.State> & Model.State = {},
    C extends Partial<BattlecryModel.Child> & Model.Child = {},
    R extends Partial<BattlecryModel.Refer> & Model.Refer = {}
> extends FeatureModel<
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

    public get route(): Readonly<Optional<{
        parent: P;
        root: RootModel;
        game: GameModel;
        owner: PlayerModel;
        opponent: PlayerModel;
    }>> {
        const route = super.route;
        const card = route.parent;
        return {
            parent: route.parent,
            root: card?.route.root,
            game: card?.route.game,
            owner: card?.route.owner,
            opponent: card?.route.opponent,
        }
    }

    public abstract toPlay(): { [K in keyof T]: Selector<T[K]> } | undefined;
    
    @EventUtil.next(self => self.event.battlecry, 'async')
    public async toRun(...target: T) {
        await this.run(...target);
        return {}
    }

    protected abstract run(...target: T): Promise<void>;
}