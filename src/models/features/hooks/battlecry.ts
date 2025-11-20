import { DebugUtil, Event, Model } from "set-piece";
import { CardModel, FeatureModel, MinionCardModel, MinionPerformModel, RoleModel, WeaponCardModel, WeaponPerformModel } from "../../..";
import { AbortEvent } from "../../../types/events/abort";
import { CardFeatureModel } from "../card";
import { Selector } from "../../../types/selector";
import { PerformModel } from "../perform";

export namespace BattlecryModel {
    export type E = {
        toRun: AbortEvent;
        onRun: Event;
    };
    export type S = {
        async: boolean;
        pending: boolean;
        multiselect: boolean;
    };
    export type C = {};
    export type R = {
        caller?: PerformModel
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
> {
    
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

    public get status() {
        if (!super.status) return false;
        if (this.state.pending) return false;
        return true;
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
                pending: false,
                multiselect: false,
                ...props.state,
            },
            child: { ...props.child },
            refer: {  ...props.refer },
        });
    }

    public run(...params: Array<T | undefined>) {
        if (!this.toRun()) return;
        this.doRun(...params);
        if (this.state.async) return;
        this.onRun();
    }

    protected toRun(): boolean | undefined {
        if (!this.status) return;
        const event = new AbortEvent({});
        this.event.toRun(event);

        if (event.detail.aborted) return;

        const name = this.state.name;
        const desc = this.state.desc;
        DebugUtil.log(`${name} run (${desc})`);
        return true;
    }

    protected onRun() {
        this.origin.state.pending = false;
        const caller = this.origin.refer.caller;
        this.origin.refer.caller = undefined;
        if (caller) caller.doPlay();
        this.event.onRun(new Event({}));
    }

    protected abstract doRun(...params: Array<T | undefined>): void;

    public abstract prepare: (...params: Array<T | undefined>) => Selector<T> | undefined;

}

