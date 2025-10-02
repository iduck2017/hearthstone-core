import { Loader } from "set-piece";
import { RoleAttackModel, CostModel, HealthModel, MinionCardModel, RoleModel } from "hearthstone-core";
import { ClassType, RaceType, RarityType } from "hearthstone-core";

export class WispModel extends MinionCardModel {
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
                    cost: props.child?.cost ?? new CostModel(() => ({ state: { current: 0 } })),
                    role: props.child?.role ?? new RoleModel(() => ({
                        child: {
                            health: new HealthModel(() => ({ state: { origin: 1 } })),
                            attack: new RoleAttackModel(() => ({ state: { current: 1 } })),
                        }
                    })),
                    ...props.child
                },
                refer: { ...props.refer },
            }
        });
    }
}