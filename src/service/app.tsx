import { DebugService, LogLevel, RouteAgent } from "set-piece";
import { RootModel } from "../common/root";
import { ExtensionModel as Extensions } from "@/common/extension";
import { PlayerModel } from "@/common/player";
import { MageHeroModel } from "@/common/hero/mage/hero";
import { MinionCardModel } from "@/common/card/minion";
import { WispCardModel } from "@/extension/legacy/wisp/card";
import { ShatteredSunClericCardModel } from "@/extension/legacy/shattered-sun-cleric/card";
import { Selector } from "@/utils/selector";
import { GameModel } from "@/common/game";

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
