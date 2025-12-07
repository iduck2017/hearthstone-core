import { ClassType, RarityType, SchoolType } from "../../../../types/card";
import { TheCoinEffectModel } from "./effect";
import { LibraryService } from "../../../../services/library";
import { CostModel } from "../../../..";
import { SpellCardModel } from "../spell";

@LibraryService.is('the-coin')
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
                effects: [new TheCoinEffectModel()],
                cost: props.child?.cost ?? new CostModel({ state: { origin: 0 }}),
                ...props.child 
            }
        });
    }
}