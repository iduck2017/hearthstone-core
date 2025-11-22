import { Method, Model } from "set-piece";
import { FeatureModel } from ".";
import { SecretCardModel } from "../entities/cards/secret";


export abstract class SecretFeatureModel<
    E extends Partial<FeatureModel.E> & Model.E = {},
    S extends Partial<FeatureModel.S> & Model.S = {},
    C extends Partial<FeatureModel.C> & Model.C = {},
    R extends Partial<FeatureModel.R> & Model.R = {},
> extends FeatureModel<E, S, C, R> {
    public get route() {
        const result = super.route;
        const secret: SecretCardModel | undefined = result.items.find(item => item instanceof SecretCardModel)
        return {
            ...result,
            secret
        }
    }

    protected get isActived(): boolean {
        if (!super.isActived) return false;
        const board = this.route.board;
        if (!board) return false;
        
        const player = this.route.player;
        if (!player) return false;
        if (!player.state.isCurrent) return false;
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
                    if (!this.isActived) return false;

                    const result = handler.call(this, ...args);
                    if (!result) return false;
                    // dispose
                    const secret = this.route.secret;
                    if (!secret) return true;
                    secret.child.dispose.destroy();
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
                isEnabled: true,
                ...props.state 
            },
            child: { ...props.child },
            refer: { ...props.refer }
        })
    }
}