import { Method, Model, State } from "set-piece";
import { CardModel } from ".";
import { DisposeModel } from "../rules/dispose";
import { SecretDisposeModel } from "../rules/dispose/secret";
import { PlayerModel } from "../player";
import { SecretDeployModel } from "../rules/deploy/secret";
import { SpellHooksOptions } from "../features/group/spell";
import { SpellCardModel } from "./spell";

export namespace SecretCardModel {
    export type S = {};
    export type E = {};
    export type C = {
        readonly dispose: SecretDisposeModel;
        readonly deploy: SecretDeployModel;
    };
    export type R = {};
}

export abstract class SecretCardModel<
    E extends Partial<SecretCardModel.E & SpellCardModel.E & CardModel.E> & Model.E = {},
    S extends Partial<SecretCardModel.S & SpellCardModel.S & CardModel.S> & Model.S = {},
    C extends Partial<SecretCardModel.C & SpellCardModel.C & CardModel.C> & Model.C = {},
    R extends Partial<SecretCardModel.R & SpellCardModel.R & CardModel.R> & Model.R = {}
> extends SpellCardModel<
    E & SecretCardModel.E,
    S & SecretCardModel.S,
    C & SecretCardModel.C,
    R & SecretCardModel.R
> {
    constructor(props: SecretCardModel['props'] & {
        state: S & State<Omit<CardModel.S, 'isActive'> & SpellCardModel.S>;
        child: C & Pick<CardModel.C, 'cost'>;
        refer: R;
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { 
                dispose: props.child.dispose ?? new SecretDisposeModel(),
                deploy: props.child.deploy ?? new SecretDeployModel(),
                ...props.child 
            },
            refer: { ...props.refer },
        });
    }
}
