import { CardModel } from "@/common/card";
import { MinionCardModel } from "@/common/card/minion";
import { ArgentSquireRoleModel } from "./role";

export class ArgentSquireCardModel extends MinionCardModel {
    public constructor(props: CardModel['props']) {
        super({
            state: {
                name: 'Argent Squire',
                desc: 'Shielded',
                mana: 1,
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