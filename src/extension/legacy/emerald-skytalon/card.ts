import { MinionCardModel } from "@/common/card/minion";
import { CardKeyword } from "@/types/card";
import { EmeraldSkytalonRoleModel } from "./role";

export class EmeraldSkytalonCardModel extends MinionCardModel {
    constructor(props: EmeraldSkytalonCardModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Emerald Skytalon',
                desc: 'Rush',
                mana: 1,
                ...props.state,
            },
            child: {
                role: new EmeraldSkytalonRoleModel({}),
                ...props.child,
            },
            refer: { ...props.refer },
        })
    }
}