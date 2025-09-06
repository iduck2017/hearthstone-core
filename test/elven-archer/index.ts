import { MinionModel, HealthModel, AttackModel, RoleModel, MinionHooksModel, LibraryUtil, CostModel } from "../../src";
import { ElvenArcherBattlecryModel } from "./battlecry";
import { ClassType, RarityType } from "../../src/types/card";
import { Loader } from "set-piece";

@LibraryUtil.is('elven-archer')
export class ElvenArcherModel extends MinionModel {
    constructor(loader?: Loader<ElvenArcherModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Elven Archer',
                    desc: 'Battlecry: Deal 1 damage.',
                    isCollectible: true,
                    flavorDesc: 'Don\'t bother asking her out on a date. She\'ll shoot you down.',
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
                        }
                    })),
                    hooks: new MinionHooksModel(() => ({
                        child: { battlecry: [new ElvenArcherBattlecryModel()] }
                    })),
                    ...props.child,
                },
                refer: { ...props.refer },
            }
        });
    }
}