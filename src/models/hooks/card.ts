import { Loader, Method, Model, Props } from "set-piece";
import { PoisonousModel } from "../entries/poisonous";
import { CARD_ROUTE, CardRoute } from "../..";

export namespace CardHooksProps {
    export type E = {};
    export type S = {};
    export type C = {
        readonly poisonous: PoisonousModel;
    };
    export type R = {};
    export type P = CardRoute;
}

export class CardHooksModel<
    E extends Partial<CardHooksProps.E> & Props.E = {},
    S extends Partial<CardHooksProps.S> & Props.S = {},
    C extends Partial<CardHooksProps.C> & Props.C = {},
    R extends Partial<CardHooksProps.R> & Props.R = {},
    P extends Partial<CardHooksProps.P> & Props.P = {}
> extends Model<
    E & CardHooksProps.E, 
    S & CardHooksProps.S, 
    C & CardHooksProps.C, 
    R & CardHooksProps.R,
    P & CardHooksProps.P
> {
    constructor(loader: Method<CardHooksModel['props'] & {
        state: S;
        child: C;
        refer: R;
        route: P
    }, []>) {
        super(() => {
            const props = loader();
            return {    
                uuid: props.uuid,
                state: { ...props.state },
                child: {    
                    poisonous: props.child.poisonous ?? new PoisonousModel(),
                    ...props.child 
                },
                refer: { ...props.refer },
                route: { 
                    ...CARD_ROUTE,
                    ...props.route 
                },
            }
        })
    }
}