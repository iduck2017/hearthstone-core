import { Model } from "set-piece";
import { GameModel } from "../game";
import { PlayerModel } from "../player";

export class SelectEvent<T = any> {
    public options: Readonly<T[]>;

    public readonly hint?: string;
    public desc?: string | ((item: T) => string);

    constructor(
        options: T[],
        props?: { 
            hint?: string; 
            desc?: string | ((item: T) => string);
        }
    ) {
        this.options = options;
        this.hint = props?.hint;
        this.desc = props?.desc;
    }

    public filter(handler: (item: T) => boolean) {
        this.options = this.options.filter(handler);
    }
    
    public resolve?: (target: T) => void;
}

export namespace ControllerModel {
    export type E = {}
    export type S = {}
    export type C = {}
    export type R = {}
}

export class ControllerModel extends Model<
    ControllerModel.E,
    ControllerModel.S,
    ControllerModel.C,
    ControllerModel.R
> {
    public get route() {
        const result = super.route;
        return {
            ...result,
            game: result.items.find(item => item instanceof GameModel),
            player: result.items.find(item => item instanceof PlayerModel),
        }
    }

    private _items: SelectEvent[] = [];
    public get current() {
        return this._items[0];
    }
    constructor(props?: ControllerModel['props']) {
        super({
            uuid: props?.uuid,
            state: { ...props?.state },
            child: { ...props?.child },
            refer: { ...props?.refer },
        });
    }

    public async get<T>(event: SelectEvent<T>) {
        if (!event.options) return;
        return new Promise<T | undefined>((resolve) => {
            event.resolve = resolve;
            this._items.push(event);
        })
    }

    public set(target: any) {
        const event = this._items.shift();
        event?.resolve?.(target);
    }
}