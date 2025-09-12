import { EffectModel, SelectEvent, RoleModel, DamageModel, DamageEvent, DamageType } from "hearthstone-core";
import { Loader, Model, StoreUtil } from "set-piece";

@StoreUtil.is('fire-ball-effect')
export class FireBallEffectModel extends EffectModel<[RoleModel]> {
    constructor(loader?: Loader<FireBallEffectModel>) {
        super(() => {
            const props = loader?.() ?? {}
            return {
                uuid: props.uuid,
                state: { 
                    name: "Fire ball's effect",
                    desc: "Deal 6 damage",
                    ...props.state 
                },
                child: { ...props.child },
                refer: { ...props.refer } 
            }
        })
    }

    toRun(): [SelectEvent<RoleModel>] | undefined {
        const games = this.route.game;
        if (!games) return;
        const roles = games.refer.roles;
        return [new SelectEvent(roles, { hint: "Choose a target" })]
    }

    protected async doRun(target: RoleModel) {
        DamageModel.run([
            new DamageEvent({
                type: DamageType.SPELL,
                source: this.child.damage,
                target,
                origin: 6
            })
        ])
    }
}