import { DebugUtil, Loader, Model, StoreUtil } from "set-piece";
import { GameModel } from "./game";
import { ConfigModel } from "./containers/config";

export namespace AppProps {
    export type S = {
        version: string;
        count: number;
    };
    export type E = {};
    export type C = {
        game?: GameModel;
        configs: ConfigModel[]
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
                state: { 
                    version: '0.1.0',
                    count: 0,
                    ...props.state
                },
                child: { 
                    configs: props.child?.configs ?? [],
                    ...props.child 
                },
                refer: { ...props.refer },
                route: {},
            }
        });
    }

    public set(config: ConfigModel): void;
    public set(game: GameModel): void;
    public set(value: GameModel | ConfigModel) {
        if (value instanceof GameModel) this.draft.child.game = value;
        if (value instanceof ConfigModel) this.draft.child.configs.push(value);
    }

    public end() { this.draft.child.game = undefined; }

}