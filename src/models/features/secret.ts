import { Method, Props } from "set-piece";
import { FeatureModel, FeatureProps } from ".";
import { SecretCardModel } from "../cards/secret";

export namespace SecretFeatureProps {
    export type E = {};
    export type S = {};
    export type C = {};
    export type R = {};
    export type P = { secret: SecretCardModel };
}

export class SecretFeatureModel<
    E extends Partial<SecretFeatureProps.E> & Props.E = {},
    S extends Partial<SecretFeatureProps.S> & Props.S = {},
    C extends Partial<SecretFeatureProps.C> & Props.C = {},
    R extends Partial<SecretFeatureProps.R> & Props.R = {},
    P extends Partial<SecretFeatureProps.P> & Props.P = {},
> extends FeatureModel<
    E & SecretFeatureProps.E,
    S & SecretFeatureProps.S,
    C & SecretFeatureProps.C,
    R & SecretFeatureProps.R,
    P & SecretFeatureProps.P
> {

    public static span() {
        return function(
            prototype: SecretFeatureModel,
            key: string,
            descriptor: TypedPropertyDescriptor<Method<boolean>>
        ): TypedPropertyDescriptor<Method<boolean>> {
            const handler = descriptor.value;
            if (!handler) return descriptor;
            const instance = {
                [key](this: SecretFeatureModel, ...args: any[]) {
                    // precheck
                    if (!this.status) return false;
                    const result = handler.call(this, ...args);
                    if (!result) return false;
                    // dispose
                    const secret = this.route.secret;
                    if (!secret) return true;
                    secret.child.dispose.active(true);
                    return true;
                }
            }
            descriptor.value = instance[key];
            return descriptor;
        }
    }

    public get status() {
        const board = this.route.board;
        if (!board) return false;

        const player = this.route.player;
        const game = this.route.game;
        if (!player) return false;
        if (!game) return false;
        const turn = game.child.turn;
        if (turn.refer.current === player) return false;
        return true;
    }


    constructor(loader: Method<SecretFeatureModel['props'] & {
        uuid: string | undefined,
        state: S & FeatureProps.S,
        child: C,
        refer: R,
        route: P,
    }, []>) {
        super(() => {
            const props = loader();
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: { ...props.child },
                refer: { ...props.refer },
                route: { 
                    secret: SecretCardModel.prototype, 
                    ...props.route 
                },
            }
        })
    }
}