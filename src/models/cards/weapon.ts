import { Event, EventUtil, Method, Model, Props, TranxUtil } from "set-piece";
import { CardModel, CardProps } from ".";
import { WeaponAttackModel } from "../rules/attack/weapon";
import { WeaponActionModel } from "../rules/action/weapon";
import { HeroModel } from "../heroes";
import { WeaponHooksEvent, WeaponHooksModel } from "../hooks/weapon";
import { RoleBattlecryModel } from "../hooks/battlecry/role";
import { WeaponDisposeModel } from "../rules/dispose/weapon";
import { TurnModel } from "../rules/turn";
import { WeaponDeployModel } from "../rules/deploy/weapon";
import { WeaponBattlecryModel } from "../hooks/battlecry/weapon";
import { WeaponPerformModel } from "../rules/perform/weapon";

export namespace WeaponCardProps {
    export type S = {};
    export type E = {
        onEquip: Event;
    };
    export type C = {
        readonly hooks: WeaponHooksModel;
        readonly attack: WeaponAttackModel;
        readonly action: WeaponActionModel;
        readonly deploy: WeaponDeployModel;
        readonly dispose: WeaponDisposeModel;
        readonly perform: WeaponPerformModel;
    };
    export type R = {};
}

export class WeaponCardModel<
    E extends Partial<WeaponCardProps.E & CardProps.E> & Props.E = {},
    S extends Partial<WeaponCardProps.S & CardProps.S> & Props.S = {},
    C extends Partial<WeaponCardProps.C & CardProps.C> & Props.C = {},
    R extends Partial<WeaponCardProps.R & CardProps.R> & Props.R = {}
> extends CardModel<
    [WeaponHooksEvent],
    E & WeaponCardProps.E,
    S & WeaponCardProps.S,
    C & WeaponCardProps.C,
    R & WeaponCardProps.R
> {
    constructor(loader: Method<WeaponCardModel['props'] & {
        state: S & WeaponCardProps.S & Omit<CardProps.S, 'isActive'>;
        child: C & Pick<WeaponCardProps.C, 'attack' | 'action'> & Pick<CardProps.C, 'cost'>;
        refer: R & WeaponCardProps.R;
    }, []>) {
        super(() => {
            const props = loader();
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: {
                    deploy: props.child.deploy ?? new WeaponDeployModel(),
                    dispose: props.child.dispose ?? new WeaponDisposeModel(),
                    hooks: props.child.hooks ?? new WeaponHooksModel(),
                    perform: props.child.perform ?? new WeaponPerformModel(),
                    ...props.child,
                },
                refer: { ...props.refer },
            }
        })
    }
}