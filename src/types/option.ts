export class Option {
    public readonly title: string;
    public readonly handler: () => void;

    constructor(title: string, handler: () => void) {
        this.title = title;
        this.handler = handler;
    }
}