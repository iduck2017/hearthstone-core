import { DebugService, RouteAgent } from "set-piece";
import { RootModel } from "../common/root";
import { ExtensionModel as Extensions } from "@/common/extension";
import { PlayerModel } from "@/common/player";
import { MageHeroModel } from "@/common/hero/mage/hero";
import { MinionCardModel } from "@/common/card/minion";
import { WispCardModel } from "@/extension/legacy/wisp/card";

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

    @DebugService.log()
    public static boot(props: {
        extensions: Extensions[];
    }) {
        AppService._extensions = props.extensions;
        AppService._root = new RootModel({});
        RouteAgent.boot(AppService._root);
        console.log(AppService._root);
    }

    @DebugService.log()
    public static debug() {
        const playerA = new PlayerModel({ child: { hero: new MageHeroModel({}) } });
        const playerB = new PlayerModel({ child: { hero: new MageHeroModel({}) } });
        AppService._root?.start({ playerA, playerB });
        playerA.child.hand.add(new WispCardModel({}));
        playerB.child.hand.add(new WispCardModel({}));
        console.log(playerA.child.hand.child.cards);
        console.log(playerB.child.hand.child.cards);
        const wisp1 = playerA.child.hand.child.cards[0];
        const wisp2 = playerB.child.hand.child.cards[0];
        if (!(wisp1 instanceof MinionCardModel)) return;
        if (!(wisp2 instanceof MinionCardModel)) return;
        wisp1.use();
        wisp2.use();
        console.log('health', wisp1.child.role?.state.health);
        wisp1.child.role.attack(wisp2.child.role);
        console.log('health', wisp1.child.role?.state.health);
    }
}
