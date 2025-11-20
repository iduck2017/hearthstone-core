import { SkillModel } from ".";
import { Selector } from "../../../types/selector";
import { CostModel } from "../../features/rules/cost";
import { DamageModel } from "../../features/rules/damage";
import { DamageEvent, DamageType } from "../../../types/events/damage";
import { TemplUtil } from "set-piece";
import { RoleModel } from "../heroes";

@TemplUtil.is('fireblast')
export class FireBlastModel extends SkillModel<RoleModel> {
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

    protected prepare(): Selector<RoleModel> | undefined {
        const game = this.route.game;
        if (!game) return;
        const roles = game.refer.roles;
        return new Selector(roles);
    }
}