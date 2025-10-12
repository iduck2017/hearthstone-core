import { SelectEvent } from "../utils/select";

export class Option {
    public readonly title: string;
    public readonly desc?: string;
    public readonly code: string;
        
    public readonly handler: () => void;

    constructor(options: {
        title: string;
        desc?: string;
        code: string;
    }, handler: () => void) {
        this.title = options.title;
        this.desc = options.desc;
        this.code = options.code;
        this.handler = handler;
    }
}