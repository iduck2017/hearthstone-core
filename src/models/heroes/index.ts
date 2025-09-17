import { Loader, Method, Model, Props } from "set-piece";
import { SkillModel } from "../skills";
import { RoleModel } from "../role";
import { ArmorModel } from "../rules/armor";
import { WeaponCardModel } from "../cards/weapon";
import { DamageModel, PlayerModel, RestoreModel } from "../..";
import { HeroDisposeModel } from "../rules/dispose/hero";
import { SpellDamageModel } from "../rules/attack/spell";

export namespace HeroProps {
    export type E = {};
    export type S = {};
    export type C = {
        readonly armor: ArmorModel;
        readonly skill: SkillModel;
        readonly role: RoleModel;
        readonly dispose: HeroDisposeModel
        readonly damage: DamageModel;
        readonly restore: RestoreModel;
        readonly spellDamage: SpellDamageModel;
    };
    export type R = {};
    export type P = {
        readonly player: PlayerModel;
    };
}

export abstract class HeroModel<
    E extends Partial<HeroProps.E> & Props.E = {},
    S extends Partial<HeroProps.S> & Props.S = {},
    C extends Partial<HeroProps.C> & Props.C = {},
    R extends Partial<HeroProps.R> & Props.R = {},
> extends Model<
    E & HeroProps.E,
    S & HeroProps.S,
    C & HeroProps.C,
    R & HeroProps.R,
    HeroProps.P
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
                    spellDamage: props.child.spellDamage ?? new SpellDamageModel(),
                    armor: props.child.armor ?? new ArmorModel(),
                    dispose: props.child.dispose ?? new HeroDisposeModel(),
                    damage: props.child.damage ?? new DamageModel(),
                    restore: props.child.restore ?? new RestoreModel(),
                    ...props.child,
                },
                refer: { ...props.refer },
                route: {
                    player: PlayerModel.prototype,
                },
            }
        })
    }
}