import { AttackModel, ClassType, HealthModel, MinionCardModel, RarityType, RaceType, RoleModel, MinionHooksModel } from "hearthstone-core";
import { VoodooDoctorBattlecryModel } from "./battlecry";
import { CostModel } from "hearthstone-core";
import { LibraryUtil } from "hearthstone-core";
import { Loader } from "set-piece";

@LibraryUtil.is('voodoo-doctor')
export class VoodooDoctorModel extends MinionCardModel {
    constructor(loader?: Loader<VoodooDoctorModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Voodoo Doctor',
                    desc: 'Battlecry: Restore 2 Health.',
                    isCollectible: true,
                    flavorDesc: 'Voodoo is an oft-misunderstood art. But it is art.',
                    rarity: RarityType.COMMON,
                    class: ClassType.NEUTRAL,
                    races: [],
                    ...props.state,
                },
                child: {
                    cost: new CostModel(() => ({ state: { origin: 1 }})),
                    role: new RoleModel(() => ({
                        child: {
                            attack: new AttackModel(() => ({ state: { origin: 2 }})),
                            health: new HealthModel(() => ({ state: { origin: 1 }})),
                        }
                    })),
                    hooks: props.child?.hooks ?? new MinionHooksModel(() => ({
                        child: {
                            battlecry: [new VoodooDoctorBattlecryModel()]
                        }
                    })),
                    ...props.child
                },
                refer: { ...props.refer }
            }
        });
    }
}