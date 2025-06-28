import { DebugService, RouteAgent } from "set-piece";
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

    @DebugService.mute()
    public static boot(props: {
        extensions: Extensions[];
    }) {
        AppService._extensions = props.extensions;
        AppService._root = new RootModel({});
        RouteAgent.boot(AppService._root);
        console.log(AppService._root);
    }

    @DebugService.log()
    public static async debug() {
        const playerA = new PlayerModel({ child: { hero: new MageHeroModel({}) } });
        const playerB = new PlayerModel({ child: { hero: new MageHeroModel({}) } });
        AppService._root?.start(new GameModel({
            child: { playerA, playerB}
        }));
        playerA.child.hand.add(new WispCardModel({}));
        playerB.child.hand.add(new WispCardModel({}));
        console.log(playerA.child.hand.child.cards);
        console.log(playerB.child.hand.child.cards);
        const card1 = playerA.child.hand.child.cards[0];
        const card2 = playerB.child.hand.child.cards[0];
        if (!card1 || !card2) return;
        await card1.preparePlay();
        await card2.preparePlay();
        const wisp1 = playerA.child.board.child.cards[0];
        const wisp2 = playerB.child.board.child.cards[0];
        if (!wisp1 || !wisp2) return;
        console.log('state', wisp1.child.role?.state);
        wisp1.child.role.attack(wisp2.child.role);
        console.log('state', wisp1.child.role?.state);
        playerA.child.hand.add(new ShatteredSunClericCardModel({}));
        const card3 = playerA.child.hand.child.cards[0];
        if (!card3) return;
        setTimeout(() => {
            console.log('selector', Selector.current);
            if (!Selector.current) return;
            const target = Selector.current.candidates[0];
            if (!target) Selector.current.cancel();
            else Selector.current.set(target);
        }, 1000)
        await card3.preparePlay();
        console.log('state', wisp1.child.role?.state);
        console.log('state', wisp2.child.role?.state);
    }
}
