import { Model } from "set-piece";
import { PlayerModel } from "../entities/player";
import { Selector } from "../../types/selector";

export abstract class SelectorModel<
    T = any,
    E extends Model.E = {},
    S extends Model.S = {},
    C extends Model.C = {},
    R extends Model.R = {},
> extends Model<E, S, C, R> {
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

