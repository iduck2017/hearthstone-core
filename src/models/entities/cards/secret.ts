import { Model, State } from "set-piece"
import { CardModel } from "."
import { SecretDisposeModel } from "../../features/dispose/secret"
import { SecretPerformModel } from "../../features/perform/secret"
import { SpellCardModel } from "./spell"

export namespace SecretCardModel {
    export type E = {}
    export type S = {}
    export type C = {
        readonly dispose: SecretDisposeModel;
        readonly perform: SecretPerformModel
    }
    export type R = {}
}

export abstract class SecretCardModel<
    E extends Partial<SecretCardModel.E & SpellCardModel.E> & Model.E = {},
    S extends Partial<SecretCardModel.S & SpellCardModel.S> & Model.S = {},
    C extends Partial<SecretCardModel.C & SpellCardModel.C> & Model.C = {},
    R extends Partial<SecretCardModel.R & SpellCardModel.R> & Model.R = {}
> extends SpellCardModel<
    E & SecretCardModel.E,
    S & SecretCardModel.S,
    C & SecretCardModel.C,
    R & SecretCardModel.R
> {
    constructor(props: SecretCardModel['props'] & {
        state: S & State<CardModel.S & SpellCardModel.S>;
        child: C & Pick<CardModel.C, 'cost'>;
        refer: R;
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { 
                dispose: props.child.dispose ?? new SecretDisposeModel(),
                perform: props.child.perform ?? new SecretPerformModel(),
                ...props.child 
            },
            refer: { ...props.refer },
        });
    }
}