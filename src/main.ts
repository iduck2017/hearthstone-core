import { DebugService, LogLevel } from "set-piece";
import { LegacyExtensionModel } from "./extension/legacy";
import { AppService } from "./service/app";

enum EnvType {
    BROWSER = 'browser',
    NODE = 'node',
}

export function main(env: EnvType) {
    if (env === EnvType.NODE) {
        DebugService.level = LogLevel.WARN;
    }
    AppService.boot({
        extensions: [ new LegacyExtensionModel({}) ],
    });
    if (env === EnvType.BROWSER) {
        window.app = AppService;
        window.root = AppService.root;
        AppService.debug()
    }
}

main(EnvType.NODE);