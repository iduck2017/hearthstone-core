import { EventUtil, Model } from "set-piece";
import { FeatureModel } from ".";
import { CardModel } from "../card";
import { RootModel } from "../root";
import { SelectReq } from "../../types/damage";

export namespace DeathrattleModel {
    export type Event = Partial<FeatureModel.Event> & {
        onBattlecry: {};
    };
    export type State = Partial<FeatureModel.State> & {};
    export type Child = Partial<FeatureModel.Child> & {};
    export type Refer = Partial<FeatureModel.Refer> & {};
}

export abstract class DeathrattleModel<
    T extends Model[] = Model[],
    E extends Partial<DeathrattleModel.Event> & Model.Event = {},
    S extends Partial<DeathrattleModel.State> & Model.State = {},
    C extends Partial<DeathrattleModel.Child> & Model.Child = {},
    R extends Partial<DeathrattleModel.Refer> & Model.Refer = {}
> extends FeatureModel<
    E & DeathrattleModel.Event, 
    S & DeathrattleModel.State, 
    C & DeathrattleModel.Child, 
    R & DeathrattleModel.Refer
> {
    constructor(props: DeathrattleModel['props'] & {
        uuid: string | undefined;
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
        root: RootModel;
        parent: Model;
        card: CardModel;
    }>> {
        const route = super.route;
        const root = route.root instanceof RootModel ? route.root : undefined;
        const card = route.parent instanceof CardModel ? route.parent : undefined;
        return {
            ...route,
            root,
            card,
        }
    }

    public async run(...target: T) {
        await this._run(...target);
        await this.event.onBattlecry({});
    }

    protected abstract _run(...target: T): Promise<void>;
}