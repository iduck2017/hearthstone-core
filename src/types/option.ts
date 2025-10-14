import { SelectEvent } from "../utils/select";

export class Option {
    public readonly title: string;
    public readonly code: string;
        
    public readonly handler: () => void;

    constructor(title: string, code: string, handler: () => void) {
        this.title = title;
        this.code = code;
        this.handler = handler;
    }
}