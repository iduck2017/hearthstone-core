import { Loader, Method, Model, Props } from "set-piece";
import { SkillModel } from "../skills";
import { RoleModel } from "../role";
import { ArmorModel } from "../rules/armor";
import { WeaponCardModel } from "../cards/weapon";
import { DamageModel, RestoreModel } from "../..";
import { HeroDisposeModel } from "../rules/dispose/hero";

export namespace HeroProps {
    export type E = {};
    export type S = {};
    export type C = {
        readonly armor: ArmorModel;
        readonly skill: SkillModel;
        readonly role: RoleModel;
        weapon?: WeaponCardModel;
        readonly dispose: HeroDisposeModel
        readonly damage: DamageModel
        readonly restore: RestoreModel;
    };
    export type R = {};
}

export abstract class HeroModel<
    E extends Partial<HeroProps.E> & Props.E = {},
    S extends Partial<HeroProps.S> & Props.S = {},
    C extends Partial<HeroProps.C> & Props.C = {},
    R extends Partial<HeroProps.R> & Props.R = {}
> extends Model<
    E & HeroProps.E,
    S & HeroProps.S,
    C & HeroProps.C,
    R & HeroProps.R
> {
    constructor(loader: Method<HeroModel['props'] & {
        state: S & HeroProps.S;
        child: C & Pick<HeroProps.C, 'skill' | 'role'>;
        refer: R & HeroProps.R;
    }, []>) {
        super(() => {
            const props = loader();
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: {
                    armor: props.child.armor ?? new ArmorModel(),
                    dispose: props.child.dispose ?? new HeroDisposeModel(),
                    damage: props.child.damage ?? new DamageModel(),
                    restore: props.child.restore ?? new RestoreModel(),
                    ...props.child,
                },
                refer: { ...props.refer },
            }
        })
    }

    public del() {
        this.draft.child.weapon = undefined;
    }

    public add(weapon: WeaponCardModel) {
        this.draft.child.weapon = weapon;
    }
}