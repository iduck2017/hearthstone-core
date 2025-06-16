import { MinionCardModel } from "@/common/card/minion";
import { Props } from "set-piece";
import { AngryBirdRoleModel } from "./role";

export class AngryBirdCardModel extends MinionCardModel {
    constructor(props: Props<
        MinionCardModel.State,
        MinionCardModel.Child,
        MinionCardModel.Refer
    >) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Angry Bird',
                desc: '',
                mana: 1,
                ...props.state,
            },
            child: {
                role: new AngryBirdRoleModel({}),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
}
