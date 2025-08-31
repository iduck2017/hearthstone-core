import { StoreUtil } from "set-piece";
import { SkillModel } from ".";
import { SelectEvent } from "../../utils/select";
import { RoleModel } from "../role";
import { CostModel } from "../rules/cost";

@StoreUtil.is('fireblast')
export class FireBlastModel extends SkillModel<[RoleModel]> {
    constructor(props: FireBlastModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                desc: 'Fireblast',
                name: 'Deal 1 damage',
                ...props.state,
            },
            child: {
                cost: props.child?.cost ?? new CostModel({ state: { origin: 2 }}),
                ...props.child,
            },
            refer: { ...props.refer },
        });
    }

    protected async doRun(target: RoleModel): Promise<void> {
        // DamageUtil.run([new DamageEvent({
        //     type: DamageType.SKILL,
        //     reason: this,
        //     target,
        //     origin: 1,
        // })])
    }

    protected toRun(): [SelectEvent<RoleModel>] | undefined {
        // const game = this.route.game;
        // if (!game) return;
        // const roles = game.refer.roles;
        // if (!roles.length) return;
        return [new SelectEvent([])];
    }

}