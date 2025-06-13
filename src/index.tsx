import React from "react";
import { createRoot } from "react-dom/client";
import { DebugService, Model, RouteAgent, StoreService } from "set-piece";
import { RootModel } from "./root";


export class AppService {
    private static _rootView?: HTMLElement;
    
    private static _rootModel?: RootModel;
    public static get rootModel() {
        return AppService._rootModel;
    }

    private constructor() {}

    @DebugService.log()
    public static boot() {
        // const ingsoc = new IngSocModel();
        // console.log('create', ingsoc);
        // ingsoc.debug();
        // AppService._rootModel = RouteAgent.boot(ingsoc);
        // window.root = AppService._rootModel;
        // AppService._rootView = document.getElementById("root") ?? undefined;
        // if (!AppService._rootView) return;
        // createRoot(AppService._rootView).render(<h1>Hello World</h1>);
    }

    @DebugService.log()
    public static test() {
        
    }
}

window.app = AppService;
AppService.boot();
AppService.test();