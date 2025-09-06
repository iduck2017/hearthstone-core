import { AttackModel, ClassType, DivineSheildModel, HealthModel, MinionModel, RarityType, RoleEntriesModel, RoleModel } from "hearthstone-core";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";
import { Loader } from "set-piece";

@LibraryUtil.is('argent-squire')
export class ArgentSquireModel extends MinionModel {
    constructor(loader?: Loader<ArgentSquireModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Argent Squire',
                    desc: 'Divine Shield',
                    isCollectible: true,
                    flavorDesc: '"I solemnly swear to uphold the Light, purge the world of darkness, and to eat only burritos." - The Argent Dawn Oath',
                    rarity: RarityType.COMMON,
                    class: ClassType.NEUTRAL,
                    races: [],
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
                                    divineShield: new DivineSheildModel(() => ({ state: { isActive: true } }))
                                }
                            }))
                        }
                    })),
                    ...props.child,
                },
                refer: { ...props.refer },
            }
        });
    }
}