import { EventUtil, Method, Model, StateUtil, TranxUtil } from "set-piece";
import { BoardModel, DeckModel, GameModel, GraveyardModel, HandModel, PlayerModel, SecretFeatureModel } from "../..";

export namespace FeatureModel {
    export type E = {
        onActive: {};
        onDeactive: {};
    };
    export type S = {
        name: string;
        desc: string;
        isActive: boolean;
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
            player: result.list.find(item => item instanceof PlayerModel),
            game: result.list.find(item => item instanceof GameModel),
        }
    }

    public get chunk() {
        if (!this.state.isActive) return undefined;
        return {
            desc: this.state.desc,
        }
    }

    protected abstract get status(): boolean;

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
        if (!this.origin.state.isActive) return false;
        if (!this.status) return false;
        return true;
    }

    public deactive() {
        this.origin.state.isActive = false;
        this.reload();
        this.event.onDeactive({});
    }
}
