import { AttackModel, CostModel, HealthModel, MinionModel, RoleModel } from "../../src";
import { ClassType, RaceType, RarityType } from "../../src/types/card";


export class WispModel extends MinionModel {
    constructor(props: WispModel['props']) {
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
                role: props.child?.role ?? new RoleModel({
                    child: {
                        health: new HealthModel({ state: { origin: 1 } }),
                        attack: new AttackModel({ state: { origin: 1 } }),
                    }
                }),
                ...props.child
            },
            refer: { ...props.refer },
        });
    }
}