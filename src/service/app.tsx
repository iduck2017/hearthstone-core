import { DebugService, RouteAgent } from "set-piece";
import { RootModel } from "../model/root";
import { ExtensionModel as Extensions } from "../model/extension";
import { PlayerModel } from "../model/player";
import { MageHeroModel } from "../model/hero/mage/hero";
import { GameModel } from "../model/game";

export class AppService {
    private static _view?: HTMLElement;
    
    private static _root?: RootModel;
    public static get root() {
        return AppService._root;
    }

    private static _extensions?: Extensions[];
    public static get extensions() {
        return AppService._extensions;
    }

    private constructor() {}

    // @DebugService.mute()
    @DebugService.log()
    public static boot(props: {
        extensions: Extensions[];
    }) {
        AppService._extensions = props.extensions;
        AppService._root = new RootModel({});
        RouteAgent.boot(AppService._root);
    }

    @DebugService.log()
    public static async debug() {
        const game = new GameModel({
            child: {
                playerA: new PlayerModel({ child: { hero: new MageHeroModel({}) } }),
                playerB: new PlayerModel({ child: { hero: new MageHeroModel({}) } }),
            }
        })
        AppService._root?.start(game);
    }
}
