import { ChargeModel, HealthModel, AttackModel, MinionModel, RaceType, RoleModel, RoleEntriesModel, ClassType, RarityType } from "hearthstone-core";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";
import { Loader } from "set-piece";

@LibraryUtil.is('stonetusk-boar')   
export class StonetuskBoarModel extends MinionModel {
    constructor(loader?: Loader<StonetuskBoarModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Stonetusk Boar',
                    desc: 'Charge',
                    isCollectible: true,
                    flavorDesc: 'This card is boaring.',
                    rarity: RarityType.COMMON,
                    class: ClassType.NEUTRAL,
                    races: [RaceType.BEAST],
                    ...props.state,
                },
                child: {
                    cost: new CostModel(() => ({ state: { origin: 1 }})),
                    role: new RoleModel(() => ({
                        child: {
                            attack: new AttackModel(() => ({ state: { origin: 1 }})),
                            health: new HealthModel(() => ({ state: { origin: 1 }})),
                            entries: new RoleEntriesModel(() => ({
                                child: {
                                    charge: new ChargeModel(() => ({ state: { isActive: true } }))
                                }
                            }))
                        }
                    })),
                    ...props.child
                },
                refer: { ...props.refer }
            }
        });
    }
}