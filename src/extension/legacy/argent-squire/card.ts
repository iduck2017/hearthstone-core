import { CardModel } from "@/common/card";
import { MinionCardModel } from "@/common/card/minion";
import { ArgentSquireRoleModel } from "./role";
import { CardKeyword } from "@/types/card";

export class ArgentSquireCardModel extends MinionCardModel {
    public constructor(props: CardModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Argent Squire',
                desc: 'Divine Shield',
                mana: 1,
                keywords: [CardKeyword.DivineShield],
                ...props.state,
            },
            child: {
                role: new ArgentSquireRoleModel({}),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }
}