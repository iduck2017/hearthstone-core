import { ClassType, CostModel, LibraryUtil, RarityType, SpellCardModel } from "hearthstone-core";
import { Loader } from "set-piece";

@LibraryUtil.is('fire-ball')
export class FireBall extends SpellCardModel {
    constructor(loader?: Loader<FireBall>) {
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
                    ...props.child 
                }
            }
        })
    }
}