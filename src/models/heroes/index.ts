import { Method, Model } from "set-piece";
import { SkillModel } from "../skills";
import { RoleModel } from "../role";
import { ArmorModel } from "../rules/armor";
import { WeaponCardModel } from "../cards/weapon";
import { DamageModel, PlayerModel, RestoreModel } from "../..";
import { HeroDisposeModel } from "../rules/dispose/hero";
import { HeroFeatsModel } from "../hero-feats";

export namespace HeroModel {
    export type E = {};
    export type S = {};
    export type C = {
        readonly armor: ArmorModel;
        readonly skill: SkillModel;
        readonly role: RoleModel;
        readonly dispose: HeroDisposeModel
        readonly damage: DamageModel;
        readonly restore: RestoreModel;
        readonly feats: HeroFeatsModel;
    };
    export type R = {};
}

export abstract class HeroModel<
    E extends Partial<HeroModel.E> & Model.E = {},
    S extends Partial<HeroModel.S> & Model.S = {},
    C extends Partial<HeroModel.C> & Model.C = {},
    R extends Partial<HeroModel.R> & Model.R = {},
> extends Model<
    E & HeroModel.E,
    S & HeroModel.S,
    C & HeroModel.C,
    R & HeroModel.R
> {
    constructor(props: HeroModel['props'] & {
        state: S & HeroModel.S;
        child: C & Pick<HeroModel.C, 'skill' | 'role'>;
        refer: R & HeroModel.R;
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: {
                feats: props.child.feats ?? new HeroFeatsModel(),
                armor: props.child.armor ?? new ArmorModel(),
                dispose: props.child.dispose ?? new HeroDisposeModel(),
                damage: props.child.damage ?? new DamageModel(),
                restore: props.child.restore ?? new RestoreModel(),
                ...props.child,
            },
            refer: { ...props.refer }
        })
    }
}