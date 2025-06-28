import { MinionCardModel } from "@/common/card/minion";
import { ShatteredSunClericRoleModel } from "./role";
import { ShatteredSunClericBattlecryModel } from "./battlecry";
import { CardKeyword } from "@/types/card";

export class ShatteredSunClericCardModel extends MinionCardModel {
    constructor(props: ShatteredSunClericCardModel['props']) {
        const battlecries = props.child?.battlecries ?? [];
        if (!battlecries.find(item => item instanceof ShatteredSunClericBattlecryModel)) {
            battlecries.push(new ShatteredSunClericBattlecryModel({}));
        }
        super({
            uuid: props.uuid,
            state: {
                name: 'Shattered Sun Cleric',
                desc: 'Battlecry: Give a friendly minion +1/+1.',
                mana: 2,
                ...props.state,
            },
            child: {
                role: new ShatteredSunClericRoleModel({}),
                ...props.child,
                battlecries,
            },
            refer: { ...props.refer },
        });
    }
}