import { DebugUtil, Model, StoreUtil } from "set-piece";
import { GameModel } from "./game";

export namespace AppModel {
    export type State = {};
    export type Event = {};
    export type Child = {
        game?: GameModel
    };
    export type Refer = {};
}

@StoreUtil.is('app')
export class AppModel extends Model<
    AppModel.Event, 
    AppModel.State, 
    AppModel.Child,
    AppModel.Refer
> {
    constructor(props: AppModel['props']) {
        super({
            uuid: props.uuid,
            state: { ...props?.state },
            child: { ...props?.child },
            refer: { ...props?.refer },
        });
    }

    @DebugUtil.log()
    public set(game?: GameModel) {
        this.draft.child.game = game;
    }
}