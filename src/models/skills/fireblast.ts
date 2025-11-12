import { SkillModel } from ".";
import { Selector } from "../rules/selector";
import { CostModel } from "../rules/card/cost";
import { DamageModel } from "../rules/card/damage";
import { DamageEvent, DamageType } from "../../types/damage-event";
import { TemplUtil } from "set-piece";
import { HeroModel } from "../heroes";
import { MinionCardModel } from "../cards/minion";
import { RoleModel } from "../features/group/hero";

@TemplUtil.is('fireblast')
export class FireBlastModel extends SkillModel<[RoleModel]> {
    constructor(props?: FireBlastModel['props']) {
        super({
            uuid: props?.uuid,
            state: {
                name: 'Fireblast',
                desc: 'Deal 1 damage',
                ...props?.state,
            },
            child: {
                cost: props?.child?.cost ?? new CostModel({ state: { origin: 2 }}),
                ...props?.child,
            },
            refer: { ...props?.refer },
        });
    }

    protected doRun(target: RoleModel) {
        const hero = this.route.hero;
        if (!hero) return;
        DamageModel.deal([
            new DamageEvent({
                type: DamageType.SKILL,
                source: hero,
                method: this,
                target,
                origin: 1,
            })
        ])
    }

    protected toRun(): [Selector<RoleModel>] | undefined {
        const game = this.route.game;
        if (!game) return;
        const roles = game.query();
        return [new Selector(roles, {})];
    }
}