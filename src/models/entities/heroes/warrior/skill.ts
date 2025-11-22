import { TemplUtil } from "set-piece";
import { SkillModel } from "../../skill";
import { CostModel } from "../../../rules/cost";
import { ArmorUpEffectModel } from "./effect";

@TemplUtil.is('armor-up')
export class ArmorUpModel extends SkillModel {
    constructor(props?: ArmorUpModel['props']) {
        super({
            uuid: props?.uuid,
            state: {
                name: 'Armor Up!',
                desc: 'Gain 2 Armor.',
                ...props?.state,
            },
            child: {
                cost: props?.child?.cost ?? new CostModel({ state: { origin: 2 }}),
                effects: props?.child?.effects ?? [new ArmorUpEffectModel()],
                ...props?.child,
            },
            refer: { ...props?.refer },
        })
    }
}