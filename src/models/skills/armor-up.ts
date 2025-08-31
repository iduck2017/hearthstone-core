import { SkillModel } from ".";
import { CostModel } from "../rules/cost";

export class ArmorUpModel extends SkillModel<[]> {
    constructor(props: ArmorUpModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                desc: 'Armor Up!',
                name: 'Gain 2 Armor.',
                ...props.state,
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 2 }}),
                ...props.child,
            },
            refer: { ...props.refer },
        })
    }

    protected async doRun(): Promise<void> {
        const player = this.route.player;
        if (!player) return;
        const armor = player.child.character.child.armor;
        armor.gain(2);
    }

    protected toRun(): [] { return [] }
}