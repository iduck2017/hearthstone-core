import { AppService } from "./service/app";
import { RootModel } from "./common/root";

declare module '*.scss' {
    const content: { [className: string]: string };
    export default content;
}

declare global {
    interface Window {
        app: AppService | undefined;
        root: RootModel | undefined;
    }
}