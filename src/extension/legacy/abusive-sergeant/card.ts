import { MinionCardModel } from "@/common/card/minion";
import { Props } from "set-piece";
import { AbusiveSergeantRoleModel } from "./role";

export class AbusiveSergeantCardModel extends MinionCardModel {
    constructor(props: Props<
        MinionCardModel.State,
        MinionCardModel.Child,
        MinionCardModel.Refer
    >) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Abusive Sergeant',
                desc: '',
                mana: 1,
                ...props.state,
            },
            child: {
                role: new AbusiveSergeantRoleModel({}),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
}