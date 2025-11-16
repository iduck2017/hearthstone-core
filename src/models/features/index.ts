import { EventUtil, Model, StateUtil } from "set-piece";
import { GameModel, PlayerModel } from "../..";

export namespace FeatureModel {
    export type E = {
        onEnable: {};
        onDisable: {};
    };
    export type S = {
        name: string;
        desc: string;
        actived: boolean;
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
        if (!this.state.actived) return undefined;
        return { desc: this.state.desc }
    }

    public get status(): boolean {
        if (!this.origin.state.actived) return false;
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

    public disable() {
        this.origin.state.actived = false;
        this.reload();
        this.event.onDisable({});
    }
}
