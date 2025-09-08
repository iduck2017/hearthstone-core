import { Loader, Method, Model, Props } from "set-piece";
import { SkillModel } from "../skills";
import { RoleModel } from "../role";
import { ArmorModel } from "../rules/armor";
import { WeaponCardModel } from "../cards/weapon";
import { CharacterDisposeModel } from "../rules/dispose/character";

export namespace CharacterProps {
    export type E = {};
    export type S = {};
    export type C = {
        readonly armor: ArmorModel;
        readonly skill: SkillModel;
        readonly role: RoleModel;
        weapon?: WeaponCardModel;
        readonly dispose: CharacterDisposeModel
    };
    export type R = {};
}

export abstract class CharacterModel<
    E extends Partial<CharacterProps.E> & Props.E = {},
    S extends Partial<CharacterProps.S> & Props.S = {},
    C extends Partial<CharacterProps.C> & Props.C = {},
    R extends Partial<CharacterProps.R> & Props.R = {}
> extends Model<
    E & CharacterProps.E,
    S & CharacterProps.S,
    C & CharacterProps.C,
    R & CharacterProps.R
> {
    constructor(loader: Method<CharacterModel['props'] & {
        state: S & CharacterProps.S;
        child: C & Pick<CharacterProps.C, 'skill' | 'role'>;
        refer: R & CharacterProps.R;
    }, []>) {
        super(() => {
            const props = loader();
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: {
                    armor: props.child.armor ?? new ArmorModel(),
                    dispose: props.child.dispose ?? new CharacterDisposeModel(),
                    ...props.child,
                },
                refer: { ...props.refer },
            }
        })
    }

    public del(weapon: WeaponCardModel) {
        this.draft.child.weapon = undefined;
    }

    public add(weapon: WeaponCardModel) {
        this.draft.child.weapon = weapon;
    }
}