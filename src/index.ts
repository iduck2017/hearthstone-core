import { LegacyExtensionModel } from "./extension/legacy";
import { AppService } from "./service/app";

AppService.boot({
    extensions: [
        new LegacyExtensionModel({}),
    ],
});
AppService.debug()
window.app = AppService;
window.root = AppService.root;
