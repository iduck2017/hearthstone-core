import { DebugUtil, Event, Method, Model } from "set-piece";
import { SelectEvent, SelectUtil } from "../../../utils/select";
import { CardModel, FeatureModel, MinionCardModel } from "../../..";
import { AbortEvent } from "../../../types/abort-event";
import { CardFeatureModel } from "../card";

export namespace MinionBattlecryModel {
    export type E = {
        toRun: AbortEvent;
        onRun: {};
    };
    export type S = {};
    export type C = {};
    export type R = {};
}

export abstract class MinionBattlecryModel<
    T extends any[] = any[],
    E extends Partial<MinionBattlecryModel.E> & Model.E = {},
    S extends Partial<MinionBattlecryModel.S> & Model.S = {},
    C extends Partial<MinionBattlecryModel.C> & Model.C = {},
    R extends Partial<MinionBattlecryModel.R> & Model.R = {}
> extends CardFeatureModel<
    E & MinionBattlecryModel.E, 
    S & MinionBattlecryModel.S, 
    C & MinionBattlecryModel.C, 
    R & MinionBattlecryModel.R
> {
    public get route() {
        const result = super.route;
        const card: CardModel | undefined = result.items.find(item => item instanceof CardModel);
        const minion: MinionCardModel | undefined = result.items.find(item => item instanceof MinionCardModel);
        return {
            ...result,
            card,
            minion,
        }
    }

    public static async select(
        hooks: Readonly<MinionBattlecryModel[]>
    ): Promise<Map<MinionBattlecryModel, Model[]> | undefined> {
        const result = new Map<MinionBattlecryModel, Model[]>();
        for (const hook of hooks) {
            const selectors = hook.toRun();
            // condition not match
            if (!selectors) continue;
            let isValid = true;
            for (const item of selectors) {
                item.desc = hook.state.desc;
                // invalid selector
                if (!item.options.length) isValid = false;
            }
            if (!isValid) continue;
            const params: Model[] = [];
            for (const item of selectors) {
                const result = await SelectUtil.get(item);
                // canceled by user
                if (result === undefined) return;
                params.push(result);
            }
            result.set(hook, params);
        }
        return result;
    }

    constructor(props: MinionBattlecryModel['props'] & {
        uuid: string | undefined;
        state: S & Pick<FeatureModel.S, 'desc' | 'name'>;
        child: C;
        refer: R;
    }) {
        super({
            uuid: props.uuid,
            state: { 
                isActive: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public async run(from: number, to: number, ...params: T) {
        if (!this.state.isActive) return;
      
        const event = new AbortEvent({});
        this.event.toRun(event);
        if (event.detail.isAbort) return;
        
        DebugUtil.log(`${this.state.name} run (${this.state.desc})`);
        await this.doRun(from, to, ...params);
        this.event.onRun(new Event({}));
    }   

    protected abstract doRun(from: number, to: number, ...params: T): Promise<void>;

    public abstract toRun(): { [K in keyof T]: SelectEvent<T[K]> } | undefined;
}