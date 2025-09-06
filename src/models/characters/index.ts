import { Loader, Method, Model, Props } from "set-piece";
import { SkillModel } from "../skills";
import { RoleModel } from "../role";
import { ArmorModel } from "../rules/armor";

export namespace CharacterModel {
    export type E = {};
    export type S = {};
    export type C = {
        readonly armor: ArmorModel;
        readonly skill: SkillModel;
        readonly role: RoleModel;
    };
    export type R = {};
}

export abstract class CharacterModel<
    E extends Partial<CharacterModel.E> & Props.E = {},
    S extends Partial<CharacterModel.S> & Props.S = {},
    C extends Partial<CharacterModel.C> & Props.C = {},
    R extends Partial<CharacterModel.R> & Props.R = {}
> extends Model<
    E & CharacterModel.E,
    S & CharacterModel.S,
    C & CharacterModel.C,
    R & CharacterModel.R
> {
    constructor(loader: Method<CharacterModel['props'] & {
        state: S & CharacterModel.S;
        child: C & Pick<CharacterModel.C, 'skill' | 'role'>;
        refer: R & CharacterModel.R;
    }, []>) {
        super(() => {
            const props = loader();
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: {
                    armor: props.child.armor ?? new ArmorModel(),
                    ...props.child,
                },
                refer: { ...props.refer },
            }
        })
    }
}