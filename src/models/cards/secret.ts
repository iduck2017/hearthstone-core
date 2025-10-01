import { Method, Model, Props, State } from "set-piece";
import { SpellCardModel, SpellCardProps } from "./spell";
import { CardProps } from ".";
import { DisposeModel } from "../rules/dispose";
import { SecretDisposeModel } from "../rules/dispose/secret";
import { PlayerModel } from "../player";
import { SecretDeployModel } from "../rules/deploy/secret";
import { SpellHooksEvent } from "../hooks/spell";

export namespace SecretCardProps {
    export type S = {};
    export type E = {};
    export type C = {
        readonly dispose: SecretDisposeModel;
        readonly deploy: SecretDeployModel;
    };
    export type R = {};
}

export abstract class SecretCardModel<
    E extends Partial<SecretCardProps.E & SpellCardProps.E & CardProps.E<[SpellHooksEvent]>> & Props.E = {},
    S extends Partial<SecretCardProps.S & SpellCardProps.S & CardProps.S> & Props.S = {},
    C extends Partial<SecretCardProps.C & SpellCardProps.C & CardProps.C<[SpellHooksEvent]>> & Props.C = {},
    R extends Partial<SecretCardProps.R & SpellCardProps.R & CardProps.R> & Props.R = {}
> extends SpellCardModel<
    E & SecretCardProps.E,
    S & SecretCardProps.S,
    C & SecretCardProps.C,
    R & SecretCardProps.R
> {
    constructor(loader: Method<SecretCardModel['props'] & {
        state: S & State<Omit<CardProps.S, 'isActive'> & SpellCardProps.S>;
        child: C & Pick<CardProps.C<[SpellHooksEvent]>, 'cost'>;
        refer: R;
    }, []>) {
        super(() => {
            const props = loader();
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: { 
                    dispose: props.child.dispose ?? new SecretDisposeModel(),
                    deploy: props.child.deploy ?? new SecretDeployModel(),
                    ...props.child 
                },
                refer: { ...props.refer },
            }
        });
    }
}
