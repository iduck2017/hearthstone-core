import React from "react";
import { createRoot } from "react-dom/client";
import { DebugService, Model, RouteAgent, StoreService } from "set-piece";
import { RootModel } from "../common/root";
import { ExtensionModel as Extensions } from "@/common/extension";
import { PlayerModel } from "@/common/player";
import { MageHeroModel } from "@/extension/classic/hero/mage/hero";

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
        window.root = AppService._root;
        RouteAgent.boot(AppService._root);
        console.log(AppService._root);
    }

    @DebugService.log()
    public static test() {
        const player1 = new PlayerModel({
            child: { hero: new MageHeroModel({}) },
        });
        const player2 = new PlayerModel({
            child: { hero: new MageHeroModel({}) },
        });
        AppService._root?.start({ player1, player2 });
        player1.child.hand.gen();
        player2.child.hand.gen();
        console.log(player1.child.hand.child.cards);
        console.log(player2.child.hand.child.cards);
        const wisp1 = player1.child.hand.child.cards[0];
        const wisp2 = player2.child.hand.child.cards[0];
        if (!wisp1?.child.role) return;
        if (!wisp2?.child.role) return;
        wisp1.use();
        wisp2.use();
        console.log('health', wisp1.child.role?.state.health);
        wisp1.child.role.attack(wisp2.child.role);
        console.log('health', wisp1.child.role?.state.health);
    }
}
