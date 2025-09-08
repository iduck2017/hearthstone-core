import { AttackModel, ClassType, HealthModel, MinionCardModel,RarityType,  RaceType, RoleEntriesModel, RoleModel, RushModel } from "hearthstone-core";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";
import { Loader } from "set-piece";

@LibraryUtil.is('emerald-skytalon')
export class EmeraldSkytalonModel extends MinionCardModel {
    constructor(loader?: Loader<EmeraldSkytalonModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Emerald Skytalon',
                    desc: 'Rush',
                    isCollectible: true,
                    flavorDesc: 'Sworn protectors of Ysera at the Emerald Dragonshrine, these majestic owls have been touched by the powers of the Emerald Dream, taking on an almost crystalline appearance.',
                    rarity: RarityType.COMMON,
                    class: ClassType.NEUTRAL,
                    races: [RaceType.BEAST, RaceType.ELEMENTAL],
                    ...props.state,
                },
                child: {
                    cost: new CostModel(() => ({ state: { origin: 1 }})),
                    role: new RoleModel(() => ({
                        child: {
                            attack: new AttackModel(() => ({ state: { origin: 2 }})),
                            health: new HealthModel(() => ({ state: { origin: 1 }})),   
                            entries: new RoleEntriesModel(() => ({
                                child: { rush: new RushModel() }
                            }))  
                        }
                    })),
                    ...props.child,
                },
                refer: { ...props.refer },
            }
        })
    }
}