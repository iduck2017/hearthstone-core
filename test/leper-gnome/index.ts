import { Loader } from "set-piece";
import { AttackModel, CardModel, ClassType, CostModel, HealthModel, LibraryUtil, MinionHooksModel, MinionModel, RarityType, RoleModel } from "../../src";
import { LeperGnomeDeathrattleModel } from "./deathrattle";

@LibraryUtil.is('leper-gnome')
export class LeperGnomeModel extends MinionModel {
    constructor(loader?: Loader<LeperGnomeModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Leper Gnome',
                    desc: 'Deathrattle: Deal 2 damage to the enemy hero.',
                    isCollectible: true,
                    flavorDesc: 'He really just wants to be your friend, but the constant rejection is starting to really get to him.',
                    rarity: RarityType.COMMON,
                    class: ClassType.NEUTRAL,
                    races: [],
                    ...props.state
                },
                child: {
                    cost: new CostModel(() => ({ state: { origin: 1 }})),
                    role: new RoleModel(() => ({
                        child: {
                            health: new HealthModel(() => ({ state: { origin: 1 }})),
                            attack: new AttackModel(() => ({ state: { origin: 2 }})),
                        },
                    })),
                    hooks: new MinionHooksModel(() => ({
                        child: { deathrattle: [new LeperGnomeDeathrattleModel()] }
                    })),
                    ...props.child
                },
                refer: { ...props.refer }
            }
        });
    }
}