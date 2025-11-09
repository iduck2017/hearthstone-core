import { Model } from "set-piece";
import { PlayerModel } from "../player";

export abstract class SelectorModel<
    T = any,
    E extends Model.E = {},
    S extends Model.S = {},
    C extends Model.C = {},
    R extends Model.R = {},
> extends Model<E, S, C, R>  {
    public get route() {
        const result = super.route;
        return {
            ...result,
            player: result.items.find(item => item instanceof PlayerModel),
        }
    }

    constructor(props: SelectorModel['props'] & {
        uuid: string | undefined;
        state: S;
        child: C;
        refer: R;
    }) {
        super({ ...props });
    }

    public abstract get selector(): Selector<T>;
}

export class Selector<T = any> {
    
    private _options: T[];
    public get options(): Readonly<T[]> { 
        return [...this._options];
    }

    public hint?: string;
    public desc?: string;
    
    private handler: Array<(item?: T) => void>;

    constructor(
        options: T[],
        config: {
            hint?: string;
            desc?: string;
            then?: (item?: T) => void;
        }
    ) {
        this._options = options;
        this.hint = config.hint;
        this.desc = config.desc;
        this.handler = config.then ? [config.then] : [];
    }

    public exclude(handler: (item: T) => boolean) {
        this._options = this._options.filter(handler);
        return this;
    }
    
    public then(handler: (item?: T) => void) {
        this.handler.push(handler);
        return this;
    }

    public emit(item: T) {
        this.handler.forEach(handler => handler(item));
        this.handler = [];
    }
}
