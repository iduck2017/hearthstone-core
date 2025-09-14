import { ClassType, CostModel, LibraryUtil, RarityType, SpellCardModel } from "hearthstone-core";
import { Loader } from "set-piece";
import { FireballEffectModel } from "./effect";

@LibraryUtil.is('fireball')
export class FireballModel extends SpellCardModel {
    constructor(loader?: Loader<FireballModel>) {
        super(() => {
            const props = loader?.() ?? {}
            return {
                uuid: props.uuid,
                state: { 
                    name: "",
                    desc: "",
                    flavorDesc: "",
                    isCollectible: true,
                    rarity: RarityType.COMMON,
                    class: ClassType.MAGE,
                    ...props.state
                },
                refer: { ...props.refer },
                child: { 
                    cost: props.child?.cost ?? new CostModel(() => ({ state: { origin: 4 }})),
                    spells: props.child?.spells ?? [new FireballEffectModel()],
                    ...props.child 
                }
            }
        })
    }
}