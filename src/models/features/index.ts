import { Event, Model, Props, TranxUtil } from "set-piece";
import { MinionModel, PlayerModel, RoleModel } from "../..";
import { GameModel } from "../..";
import { BoardModel } from "../..";
import { CardModel } from "../..";
import { DamageModel } from "../..";

export enum FeatureStatus {
    INACTIVE = 0,
    ACTIVE = 1
}

export namespace FeatureProps {
    export type E = {
        toSilence: Event;
        onSilence: Event;
    };
    export type S = {
        name: string;
        desc: string;
        status: number;
    }
    export type C = {
        damage: DamageModel;
    };
    export type R = {};
}

export abstract class FeatureModel<
    E extends Partial<FeatureProps.E> & Props.E = {},
    S extends Partial<FeatureProps.S> & Props.S = {},
    C extends Partial<FeatureProps.C> & Props.C = {},
    R extends Partial<FeatureProps.R> & Props.R = {}
> extends Model<
    E & FeatureProps.E,
    S & FeatureProps.S,
    C & FeatureProps.C,
    R & FeatureProps.R
> {
    public get route() {
        const route = super.route;
        const card: CardModel | undefined = route.order.find(item => item instanceof CardModel);
        const minion: MinionModel | undefined = route.order.find(item => item instanceof MinionModel);
        return { 
            ...route, 
            card,
            role: route.order.find(item => item instanceof RoleModel),
            game: route.order.find(item => item instanceof GameModel),
            board: route.order.find(item => item instanceof BoardModel),
            player: route.order.find(item => item instanceof PlayerModel)
        }
    } 

    constructor(props: FeatureModel['props'] & {
        uuid: string | undefined;
        state: S & Pick<FeatureProps.S, 'name' | 'desc' | 'status'>;
        child: C,
        refer: R,
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { 
                damage: props.child?.damage ?? new DamageModel({}),
                ...props.child
            },
            refer: { ...props.refer },
        })
    }

    public silence(): boolean {
        const signal = this.event.toSilence(new Event({}));
        if (signal.isCancel) return false;
        this.disable();
        this.event.onSilence(new Event({}));
        return true;
    }

    @TranxUtil.span()
    public disable() {
        this.draft.state.status = FeatureStatus.INACTIVE;
        this.reload();
    }
}
