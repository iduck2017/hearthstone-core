import { TemplUtil } from "set-piece";
import { SkillModel } from ".";
import { CostModel } from "../../features/rules/cost";

@TemplUtil.is('armor-up')
export class ArmorUpModel extends SkillModel<never> {
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
                ...props?.child,
            },
            refer: { ...props?.refer },
        })
    }

    protected execute() {
        const player = this.route.player;
        if (!player) return;
        const armor = player.child.hero.child.armor;
        armor.gain(2);
    }

    protected prepare() {
        return undefined;
    }
}