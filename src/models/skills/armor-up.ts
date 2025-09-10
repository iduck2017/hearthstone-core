import { Loader } from "set-piece";
import { SkillModel } from ".";
import { CostModel } from "../rules/cost";

export class ArmorUpModel extends SkillModel<[]> {
    constructor(loader?: Loader<ArmorUpModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    desc: 'Armor Up!',
                    name: 'Gain 2 Armor.',
                    ...props.state,
                },
                child: {
                    cost: new CostModel(() => ({ state: { origin: 2 }})),
                    ...props.child,
                },
                refer: { ...props.refer },
            }
        })
    }

    protected async doRun(): Promise<void> {
        const player = this.route.player;
        if (!player) return;
        const armor = player.child.hero.child.armor;
        armor.gain(2);
    }

    protected toRun(): [] { return [] }
}