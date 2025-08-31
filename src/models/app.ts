import { DebugUtil, Model, StoreUtil } from "set-piece";
import { GameModel } from "./game";

export namespace AppProps {
    export type S = {};
    export type E = {};
    export type C = {
        game?: GameModel
    };
    export type R = {};
}

@StoreUtil.is('app')
export class AppModel extends Model<
    AppProps.E, 
    AppProps.S, 
    AppProps.C, 
    AppProps.R
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