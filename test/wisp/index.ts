import { MinionCardModel, CostModel, RoleHealthModel, RoleAttackModel } from "../../src";
import { RarityType, ClassType, RaceType } from "../../src/types/card-enums";

export class WispModel extends MinionCardModel {
    constructor(props?: WispModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: 'Wisp',
                desc: '',
                flavorDesc: '',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                isCollectible: false,
                races: [RaceType.UNDEAD],
                ...props.state,
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 0 } }),
                health: new RoleHealthModel({ state: { origin: 1 } }),
                attack: new RoleAttackModel({ state: { origin: 1 } }),
                ...props.child
            },
            refer: { ...props.refer },
        });
    }
}