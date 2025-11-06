import { Model } from "set-piece";
import { GameModel } from "../game";
import { PlayerModel } from "../player";
import { SelectEvent } from "../../utils/select";

export namespace SelectorModel {
    export type E = {}
    export type S = {}
    export type C = {}
    export type R = {}
}

export class SelectorModel extends Model<
    SelectorModel.E,
    SelectorModel.S,
    SelectorModel.C,
    SelectorModel.R
> {
    public get route() {
        const result = super.route;
        return {
            ...result,
            game: result.items.find(item => item instanceof GameModel),
            player: result.items.find(item => item instanceof PlayerModel),
        }
    }

    private _current: SelectEvent | undefined;
    public get current() {
        return this._current;
    }
    constructor(props?: SelectorModel['props']) {
        super({
            uuid: props?.uuid,
            state: { ...props?.state },
            child: { ...props?.child },
            refer: { ...props?.refer },
        });
    }

    public async get<T>(event: SelectEvent<T>) {
        if (this._current) return;
        if (!event.options) return;
        return new Promise<T | undefined>((resolve) => {
            this._current = event;
            this.set = (target: T) => {
                if (!event.options.includes(target)) return;
                this._current = undefined;
                resolve(target);
            };
        })
    }

    public set(target: any) {}
}