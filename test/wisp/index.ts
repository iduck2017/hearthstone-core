import { Loader } from "set-piece";
import { AttackModel, CostModel, HealthModel, MinionModel, RoleModel } from "hearthstone-core";
import { ClassType, RaceType, RarityType } from "hearthstone-core";

export class WispModel extends MinionModel {
    constructor(loader?: Loader<WispModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
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
                    cost: props.child?.cost ?? new CostModel(() => ({ state: { origin: 0 } })),
                    role: props.child?.role ?? new RoleModel(() => ({
                        child: {
                            health: new HealthModel(() => ({ state: { origin: 1 } })),
                            attack: new AttackModel(() => ({ state: { origin: 1 } })),
                        }
                    })),
                    ...props.child
                },
                refer: { ...props.refer },
            }
        });
    }
}