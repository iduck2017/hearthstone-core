import { Method, Model } from "set-piece";
import { SkillModel } from "../skills";
import { ArmorModel } from "../rules/hero/armor";
import { DamageModel, OverhealModel, RestoreModel, RoleAttackModel, RoleHealthModel, SleepModel } from "../..";
import { HeroDisposeModel } from "../cards/dispose/hero";
import { HeroFeaturesModel } from "../features/group/hero";
import { RoleActionModel } from "../rules/role/action";

export namespace HeroModel {
    export type E = {};
    export type S = {};
    export type C = {
        readonly armor: ArmorModel;
        readonly skill: SkillModel;
        readonly dispose: HeroDisposeModel
        readonly damage: DamageModel;
        readonly sleep: SleepModel;
        readonly health: RoleHealthModel;
        readonly attack: RoleAttackModel;
        readonly action: RoleActionModel;
        readonly restore: RestoreModel;
        readonly feats: HeroFeaturesModel;
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
        child: C & Pick<HeroModel.C, 'skill'>;
        refer: R & HeroModel.R;
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: {
                overheal: [],
                sleep: props.child.sleep ?? new SleepModel({ state: { isActive: false }}),
                health: props.child.health ?? new RoleHealthModel(),
                attack: props.child.attack ?? new RoleAttackModel(),
                action: props.child.action ?? new RoleActionModel(),
                feats: props.child.feats ?? new HeroFeaturesModel(),
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