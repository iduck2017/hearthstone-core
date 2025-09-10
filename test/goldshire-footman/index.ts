/*
 * Goldshire Footman
 * If 1/2 minions are all that is defending Goldshire, you would think it would have been overrun years ago.
 * 
 * Taunt
 * 
 * Type: Minion
 * Rarity: Common
 * Set: Legacy
 * Class: Neutral
 * Cost to Craft: 40 / 400 (Golden)
 * Disenchanting Yield: 5 / 50 (Golden)
 * Artist: Alex Horley Orlandelli
 * Collectible
 */
import { MinionCardModel, HealthModel, RoleAttackModel, RoleModel, RoleEntriesModel, TauntModel, LibraryUtil, CostModel } from "hearthstone-core";
import { ClassType, RarityType } from "hearthstone-core";
import { Loader } from "set-piece";

@LibraryUtil.is('goldshire-footman')
export class GoldshireFootmanModel extends MinionCardModel {
    constructor(loader?: Loader<GoldshireFootmanModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Goldshire Footman',
                    desc: 'Taunt',
                    isCollectible: true,
                    flavorDesc: 'If 1/2 minions are all that is defending Goldshire, you would think it would have been overrun years ago.',
                    rarity: RarityType.COMMON,
                    class: ClassType.NEUTRAL,
                    races: [],
                    ...props.state
                },
                child: {
                    cost: new CostModel(() => ({ state: { origin: 1 }})),
                    role: new RoleModel(() => ({
                        child: {
                            attack: new RoleAttackModel(() => ({ state: { origin: 1 }})),
                            health: new HealthModel(() => ({ state: { origin: 2 }})),   
                            entries: new RoleEntriesModel(() => ({
                                child: {
                                    taunt: new TauntModel()
                                }
                            }))  
                        }
                    })),
                    ...props.child,
                },
                refer: { ...props.refer }
            }
        });
    }
}