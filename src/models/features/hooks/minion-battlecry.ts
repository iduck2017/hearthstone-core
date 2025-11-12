import { DebugUtil, Event, Method, Model } from "set-piece";
import { CardModel, FeatureModel, MinionCardModel, Selector } from "../../..";
import { AbortEvent } from "../../../types/abort-event";
import { CardFeatureModel } from "../card";
import { PlayerModel } from "../../player";
import { CallerModel } from "../../rules/caller";
import { CalleeModel } from "../../rules/callee";

export namespace MinionBattlecryModel {
    export type E = {
        toRun: AbortEvent;
        onRun: {};
    };
    export type S = {
        isAsync: boolean;
    };
    export type C = {};
    export type R = {
        callers: CallerModel<[MinionBattlecryModel]>[]
    };
}

export abstract class MinionBattlecryModel<
    T extends any[] = any[],
    E extends Partial<MinionBattlecryModel.E> & Partial<FeatureModel.E> & Model.E = {},
    S extends Partial<MinionBattlecryModel.S> & Partial<FeatureModel.S> & Model.S = {},
    C extends Partial<MinionBattlecryModel.C> & Partial<FeatureModel.C> & Model.C = {},
    R extends Partial<MinionBattlecryModel.R> & Partial<FeatureModel.R> & Model.R = {}
> extends CardFeatureModel<
    E & MinionBattlecryModel.E,
    S & MinionBattlecryModel.S, 
    C & MinionBattlecryModel.C, 
    R & MinionBattlecryModel.R
> implements CalleeModel<[MinionBattlecryModel]> {
    
    public readonly promise = CalleeModel.prototype.promise.bind(this);
    public readonly resolve = CalleeModel.prototype.resolve.bind(this);

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
        player: PlayerModel,
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
                const result = await player.child.controller.get(item);
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
                isAsync: false,
                ...props.state,
            },
            child: { ...props.child },
            refer: { 
                callers: [],
                ...props.refer 
            },
        });
    }


    public run(from: number, to: number, ...params: T) {
        if (!this.state.isActive) return;
      
        const event = new AbortEvent({});
        this.event.toRun(event);
        if (event.detail.isAbort) return;
        
        DebugUtil.log(`${this.state.name} run (${this.state.desc})`);

        
        this.doRun(from, to, ...params);
        if (!this.state.isAsync) this.onRun();
    }

    protected onRun() {
        this.event.onRun(new Event({}));
        this.resolve(this);
    }

    protected abstract doRun(from: number, to: number, ...params: T): void;

    public abstract toRun(): { [K in keyof T]: Selector<T[K]> } | undefined;
}

