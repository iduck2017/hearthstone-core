import { SpellCardModel } from "../spell";
import { ClassType, RarityType, SchoolType } from "../../../types/card-enums";
import { CostModel } from "../../rules/card/cost";
import { SpellFeaturesModel } from "../../features/group/spell";
import { TheCoinEffectModel } from "./effect";
import { LibraryUtil } from "../../../utils/library";

@LibraryUtil.is('the-coin')
export class TheCoinModel extends SpellCardModel {
    constructor(props?: TheCoinModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: { 
                name: "The Coin",
                desc: "Gain 1 Mana Crystal this turn only.",
                flavorDesc: "",
                isCollectible: false,
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                schools: [],
                ...props.state
            },
            refer: { ...props.refer },
            child: { 
                cost: props.child?.cost ?? new CostModel({ state: { origin: 0 }}),
                feats: props.child?.feats ?? new SpellFeaturesModel({
                    child: { effects: [new TheCoinEffectModel()] }
                }),
                ...props.child 
            }
        });
    }
}