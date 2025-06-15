import { ClassicExtensionModel } from "./extension/classic";
import { AppService } from "./service/app";

window.app = AppService;
AppService.boot({
    extensions: [
        new ClassicExtensionModel({}),
    ],
});
AppService.test();