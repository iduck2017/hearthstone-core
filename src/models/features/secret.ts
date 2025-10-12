import { Method, Model } from "set-piece";
import { SecretCardModel } from "../cards/secret";
import { FeatureModel } from ".";
import { BoardModel } from "../cards/group/board";
import { CardFeatureModel } from "./card";

export namespace SecretFeatureModel {
    export type E = {};
    export type S = {};
    export type C = {};
    export type R = {};
}

export abstract class SecretFeatureModel<
    E extends Partial<SecretFeatureModel.E> & Model.E = {},
    S extends Partial<SecretFeatureModel.S> & Model.S = {},
    C extends Partial<SecretFeatureModel.C> & Model.C = {},
    R extends Partial<SecretFeatureModel.R> & Model.R = {},
> extends CardFeatureModel<
    E & SecretFeatureModel.E,
    S & SecretFeatureModel.S,
    C & SecretFeatureModel.C,
    R & SecretFeatureModel.R
> {
    public get route() {
        const result = super.route;
        return {
            ...result,
            secret: result.list.find(item => item instanceof SecretCardModel),
        }
    }

    protected get status(): boolean {
        const board = this.route.board;
        if (!board) return false;
        return true;
    }

    public static span() {
        return function(
            prototype: SecretFeatureModel,
            key: string,
            descriptor: TypedPropertyDescriptor<Method>
        ): TypedPropertyDescriptor<Method> {
            const handler = descriptor.value;
            if (!handler) return descriptor;
            const instance = {
                [key](this: SecretFeatureModel, ...args: any[]) {
                    // precheck
                    if (!this.status) return false;
                    const player = this.route.player;
                    const game = this.route.game;
                    if (!player) return false;
                    if (!game) return false;
                    const turn = game.child.turn;
                    if (turn.refer.current === player) return false;
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

    constructor(props: SecretFeatureModel['props'] & {
        uuid: string | undefined,
        state: S & Pick<FeatureModel.S, 'desc' | 'name'>,
        child: C,
        refer: R,
    }) {
        super({
            uuid: props.uuid,
            state: { 
                isActive: true,
                ...props.state 
            },
            child: { ...props.child },
            refer: { ...props.refer }
        })
    }
}