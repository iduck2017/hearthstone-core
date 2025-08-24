import { SkillModel } from ".";
import { SelectEvent } from "../../utils/select";
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
                cost: new CostModel({ state: { origin: 2 }}),
                ...props.child,
            },
            refer: { ...props.refer },
        })
    }

    protected async doRun(): Promise<void> {
        const player = this.route.player;
        if (!player) return;
        const armor = player.child.armor;
    }

    protected toRun(): [] { return [] }
}