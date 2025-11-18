import { DebugUtil, Event, Model } from "set-piece";
import { CardModel, FeatureModel, MinionCardModel, RoleModel, WeaponCardModel } from "../../..";
import { AbortEvent } from "../../../types/events/abort";
import { CardFeatureModel } from "../card";
import { CallerModel } from "../../common/caller";
import { CalleeModel } from "../../common/callee";
import { Selector } from "../../../types/selector";

export namespace BattlecryModel {
    export type E = {
        toRun: AbortEvent;
        onRun: Event;
    };
    export type S = {
        async: boolean;
        multiselect: boolean;
    };
    export type C = {};
    export type R = {
        callers: CallerModel<[BattlecryModel]>[]
    };
}

export abstract class BattlecryModel<
    T extends Model = Model,
    E extends Partial<BattlecryModel.E> & Partial<FeatureModel.E> & Model.E = {},
    S extends Partial<BattlecryModel.S> & Partial<FeatureModel.S> & Model.S = {},
    C extends Partial<BattlecryModel.C> & Partial<FeatureModel.C> & Model.C = {},
    R extends Partial<BattlecryModel.R> & Partial<FeatureModel.R> & Model.R = {}
> extends CardFeatureModel<
    E & BattlecryModel.E,
    S & BattlecryModel.S, 
    C & BattlecryModel.C, 
    R & BattlecryModel.R
> implements CalleeModel<[BattlecryModel]> {
    
    public readonly promise = CalleeModel.prototype.promise.bind(this);
    public readonly resolve = CalleeModel.prototype.resolve.bind(this);

    public get route() {
        const result = super.route;
        const card: CardModel | undefined = result.items.find(item => item instanceof CardModel);
        const minion: MinionCardModel | undefined = result.items.find(item => item instanceof MinionCardModel);
        const weapon: WeaponCardModel | undefined = result.items.find(item => item instanceof WeaponCardModel);
        return {
            ...result,
            card,
            minion,
            weapon,
        }
    }

    constructor(props: BattlecryModel['props'] & {
        uuid: string | undefined;
        state: S & Pick<FeatureModel.S, 'desc' | 'name'>;
        child: C;
        refer: R;
    }) {
        super({
            uuid: props.uuid,
            state: { 
                actived: true,
                async: false,
                multiselect: false,
                ...props.state,
            },
            child: { 
                ...props.child,
            },
            refer: { 
                callers: [],
                ...props.refer 
            },
        });
    }


    public start(...params: Array<T | undefined>) {
        if (!this.state.actived) return;
        const event = new AbortEvent({});
        this.event.toRun(event);
        if (event.detail.aborted) return;
        const name = this.state.name;
        const desc = this.state.desc;
        DebugUtil.log(`${name} run (${desc})`);
        this.run(params);
        if (!this.state.async) this.end();
    }

    protected end() {
        this.event.onRun(new Event({}));
        this.resolve(this);
    }

    protected abstract run(params: Array<T | undefined>): void;

    public abstract prepare(prev: Array<T | undefined>): Selector<T> | undefined;

}

