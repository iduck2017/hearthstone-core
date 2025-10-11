import { Method, Model, TranxUtil } from "set-piece";
import { CardModel } from ".";
import { WeaponAttackModel } from "../rules/weapon-attack";
import { WeaponActionModel } from "../rules/weapon-action";
import { WeaponHooksOptions, WeaponFeatsModel } from "../features/weapon";
import { WeaponDisposeModel } from "../rules/dispose/weapon";
import { WeaponDeployModel } from "../rules/deploy/weapon";
import { WeaponPerformModel } from "../rules/perform/weapon";

export namespace WeaponCardModel {
    export type S = {};
    export type E = {};
    export type C = {
        readonly feats: WeaponFeatsModel;
        readonly attack: WeaponAttackModel;
        readonly action: WeaponActionModel;
        readonly deploy: WeaponDeployModel;
        readonly dispose: WeaponDisposeModel;
        readonly perform: WeaponPerformModel;
    };
    export type R = {};
}

@TranxUtil.span(true)
export abstract class WeaponCardModel<
    E extends Partial<WeaponCardModel.E & CardModel.E> & Model.E = {},
    S extends Partial<WeaponCardModel.S & CardModel.S> & Model.S = {},
    C extends Partial<WeaponCardModel.C & CardModel.C> & Model.C = {},
    R extends Partial<WeaponCardModel.R & CardModel.R> & Model.R = {}
> extends CardModel<
    E & WeaponCardModel.E,
    S & WeaponCardModel.S,
    C & WeaponCardModel.C,
    R & WeaponCardModel.R
> {
    constructor(props: WeaponCardModel['props'] & {
        state: S & WeaponCardModel.S & Omit<CardModel.S, 'isActive'>;
        child: C & Pick<WeaponCardModel.C, 'attack' | 'action'> & Pick<CardModel.C, 'cost'>;
        refer: R & WeaponCardModel.R;
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: {
                deploy: props.child.deploy ?? new WeaponDeployModel(),
                dispose: props.child.dispose ?? new WeaponDisposeModel(),
                feats: props.child.feats ?? new WeaponFeatsModel(),
                perform: props.child.perform ?? new WeaponPerformModel(),
                ...props.child,
            },
            refer: { ...props.refer },
        })
    }
}