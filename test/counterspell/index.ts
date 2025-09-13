import { ClassType, CostModel, LibraryUtil, RarityType, SecretCardModel, SpellCardModel } from "hearthstone-core";
import { Loader } from "set-piece";
import { CounterspellFeatureModel } from "./feature";

@LibraryUtil.is('counterspell')
export class CounterspellModel extends SecretCardModel {
    constructor(loader?: Loader<CounterspellModel>) {
        super(() => {
            const props = loader?.() ?? {}
            return {
                uuid: props.uuid,
                state: { 
                    name: "Counterspell",
                    desc: "Secret: When your opponent casts a spell, Counter it.",
                    flavorDesc: "What's the difference between a mage playing with Counterspell and a mage who isn't? The mage who isn't is getting Pyroblasted in the face.",
                    isCollectible: true,
                    rarity: RarityType.COMMON,
                    class: ClassType.MAGE,
                    ...props.state
                },
                refer: { ...props.refer },
                child: { 
                    cost: props.child?.cost ?? new CostModel(() => ({ state: { origin: 3 }})),
                    feats: props.child?.feats ?? [new CounterspellFeatureModel()],
                    ...props.child 
                }
            }
        })
    }
}