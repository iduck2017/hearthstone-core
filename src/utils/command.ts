import { AppModel } from "../models/app";

export class CommandUtil {
    public readonly title: string;
    public readonly handler: () => void;

    constructor(title: string, handler: () => void) {
        this.title = title;
        this.handler = () => {
            handler();
        };
    }
}