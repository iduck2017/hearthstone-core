import { DebugUtil, Loader, Model, StoreUtil } from "set-piece";
import { GameModel } from "./game";

export namespace AppProps {
    export type S = {};
    export type E = {};
    export type C = {
        game?: GameModel
    };
}

@StoreUtil.is('app')
export class AppModel extends Model<
    AppProps.E, 
    AppProps.S, 
    AppProps.C
> {
    constructor(loader?: Loader<AppModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: { ...props.child },
                refer: { ...props.refer },
                route: {},
            }
        });
    }

    @DebugUtil.log()
    public set(game?: GameModel) {
        this.draft.child.game = game;
    }
}