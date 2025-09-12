import { EffectModel, SelectEvent, RoleModel, DamageModel, DamageEvent, DamageType } from "hearthstone-core";
import { DebugUtil, Loader, LogLevel, Model, StoreUtil } from "set-piece";

@StoreUtil.is('fireball-effect')
export class FireballEffectModel extends EffectModel<[RoleModel]> {
    constructor(loader?: Loader<FireballEffectModel>) {
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
        const card = this.route.card;
        if (!card) return;
        DamageModel.run([
            new DamageEvent({
                type: DamageType.SPELL,
                source: card,
                detail: this,
                target,
                origin: 6
            })
        ])
    }
}