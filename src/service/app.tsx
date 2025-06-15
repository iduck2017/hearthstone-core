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
        const p1 = new PlayerModel({
            child: { hero: new MageHeroModel({}) },
        });
        const p2 = new PlayerModel({
            child: { hero: new MageHeroModel({}) },
        });
        AppService._root?.start({ p1, p2 });
        p1.child.hand.get();
        p2.child.hand.get();
        console.log(p1.child.hand.child.cards);
        console.log(p2.child.hand.child.cards);
    }
}
