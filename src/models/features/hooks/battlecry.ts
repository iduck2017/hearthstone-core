import { DebugUtil, Event, Model } from "set-piece";
import { CardModel, FeatureModel, MinionCardModel, WeaponCardModel } from "../../..";
import { AbortEvent } from "../../../types/events/abort";
import { CardFeatureModel } from "../card";
import { Selector } from "../../../types/selector";

export namespace BattlecryModel {
    export type E = {
        toRun: AbortEvent;
        onRun: Event;
    };
    export type S = {
        isPending: boolean;
        isMultiselect: boolean;
    };
    export type C = {};
    export type R = {};
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

    constructor(props: BattlecryModel['props'] & {
        uuid: string | undefined;
        state: S & Pick<FeatureModel.S, 'desc' | 'name'>;
        child: C;
        refer: R;
    }) {
        super({
            uuid: props.uuid,
            state: { 
                isActived: true,
                isPending: false,
                isMultiselect: false,
                ...props.state,
            },
            child: { ...props.child },
            refer: {  ...props.refer },
        });
    }

    public async run(params: Array<T | undefined>) {
        // toRun
        if (!this.state.isPending) {
            if (!this.status) return;
            const event = new AbortEvent({});
            this.event.toRun(event);
            const isValid = event.detail.isValid;
            if (!isValid) return;

            this.origin.state.isPending = true;
        }
        
        // run
        await this.doRun(params);
        this.origin.state.isPending = false;

        // onRun
        const name = this.state.name;
        const desc = this.state.desc;
        DebugUtil.log(`${name} run: ${desc}`);
        this.event.onRun(new Event({}));
    }

    protected abstract doRun(params: Array<T | undefined>): Promise<void>;

    public abstract prepare(params: Array<T | undefined>): Selector<T> | undefined;

}

