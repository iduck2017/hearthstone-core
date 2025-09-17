import { Loader, StoreUtil } from "set-piece";
import { SkillModel } from ".";
import { SelectEvent } from "../../utils/select";
import { RoleModel } from "../role";
import { CostModel } from "../rules/cost";
import { DamageModel } from "../actions/damage";
import { DamageEvent, DamageType } from "../../types/damage";

@StoreUtil.is('fireblast')
export class FireBlastModel extends SkillModel<[RoleModel]> {
    constructor(loader?: Loader<FireBlastModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    desc: 'Fireblast',
                    name: 'Deal 1 damage',
                    ...props.state,
                },
                child: {
                    cost: props.child?.cost ?? new CostModel(() => ({ 
                        state: { origin: 2 }
                    })),
                    ...props.child,
                },
                refer: { ...props.refer },
            }
        });
    }

    protected async doRun(target: RoleModel): Promise<void> {
        const hero = this.route.hero;
        if (!hero) return;
        DamageModel.run([
            new DamageEvent({
                type: DamageType.SKILL,
                source: hero,
                detail: this,
                target,
                origin: 1,
            })
        ])
    }

    protected toRun(): [SelectEvent<RoleModel>] | undefined {
        const game = this.route.game;
        if (!game) return;
        const roles = game.query();
        return [new SelectEvent(roles)];
    }
}