import { DebugService, LogLevel } from "set-piece";
import { LegacyExtensionModel } from "./extension/legacy";
import { AppService } from "./service/app";

export function main(options: {
    level: LogLevel
}) {
    DebugService.level = options.level;
    AppService.boot({
        extensions: [ new LegacyExtensionModel({}) ],
    });
    if (global.window) {
        global.window.app = AppService;
        global.window.root = AppService.root;
    }
}

main({ level: LogLevel.WARN });