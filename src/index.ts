import { LegacyExtensionModel } from "./extension/legacy";
import { AppService } from "./service/app";

window.app = AppService;
AppService.boot({
    extensions: [
        new LegacyExtensionModel({}),
    ],
});
AppService.test();