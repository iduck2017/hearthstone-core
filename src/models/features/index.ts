import { Event, EventUtil, Model, StateUtil } from "set-piece";
import { GameModel, PlayerModel } from "../..";

export namespace FeatureModel {
    export type E = {
        onActive: {};
        onDeactive: {};
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

    public get isValid(): boolean {
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
        return this.isValid;
    }

    public deactive() {
        if (!this.origin.state.isActived) return false;
        this.doDeactive();
        this.event.onDeactive(new Event({}));
    }

    protected doDeactive() {
        this.origin.state.isActived = false;
        this.reload();
    }

}
