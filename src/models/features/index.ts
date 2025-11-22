import { Event, EventUtil, Model, StateUtil, TranxUtil } from "set-piece";
import { AbortEvent, GameModel, PlayerModel } from "../..";

export namespace FeatureModel {
    export type E = {
        toActive: AbortEvent;
        onActive: Event;
        onDeactive: Event;
    };
    export type S = {
        name: string;
        desc: string;
        isActived: boolean;
    }
    export type C = {};
    export type R = {};
}

export abstract class FeatureModel<
    E extends Partial<FeatureModel.E> & Model.E = {},
    S extends Partial<FeatureModel.S> & Model.S = {},
    C extends Partial<FeatureModel.C> & Model.C = {},
    R extends Partial<FeatureModel.R> & Model.R = {},
> extends Model<
    E & FeatureModel.E,
    S & FeatureModel.S,
    C & FeatureModel.C,
    R & FeatureModel.R
> {
    public get route() {
        const result = super.route;
        return {
            ...result,
            player: result.items.find(item => item instanceof PlayerModel),
            game: result.items.find(item => item instanceof GameModel),
        }
    }

    public get chunk() {
        if (!this.state.isActived) return undefined;
        return { desc: this.state.desc }
    }

    public get status(): boolean {
        if (!this.origin.state.isActived) return false;
        return true;
    }

    constructor(props: FeatureModel['props'] & {
        uuid: string | undefined;
        state: S & FeatureModel.S;
        child: C,
        refer: R,
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer }
        })
    }

    @EventUtil.if()
    @StateUtil.if()
    private check() {
        return this.status;
    }


    public active() {
        if (this.origin.state.isActived) return false;

        // toActive
        const event = new AbortEvent({});
        this.event.toActive(event);
        const isValid = event.detail.isValid;
        if (!isValid) return false;
        // execute
        this.doActive();
        // after
        this.event.onActive(new Event({}));
    }

    @TranxUtil.span()
    protected doActive() {
        this.origin.state.isActived = true;
        this.reload();
    }

    public deactive() {
        if (!this.origin.state.isActived) return false;
        this.doDeactive();
        this.event.onDeactive(new Event({}));
    }

    @TranxUtil.span()
    protected doDeactive() {
        this.origin.state.isActived = false;
        this.reload();
    }

}
