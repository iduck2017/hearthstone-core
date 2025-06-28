import { FeatureModel } from "@/common/feature";
import { EffectModel } from "@/common/feature/effect";
import { RoleModel } from "@/common/role";
import { Event, EventAgent, StateAgent, TranxService } from "set-piece";
import { DeepReadonly } from "utility-types";

export namespace AngryBirdEffectModel {
    export type State = Partial<FeatureModel.State> & {
        readonly isEnable: false;
    }
    export type Event = {}
}

export class AngryBirdEffectModel extends EffectModel<
    RoleModel,
    AngryBirdEffectModel.Event,
    AngryBirdEffectModel.State
> {
    constructor(props: AngryBirdEffectModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Angry Bird\'s Buff',
                desc: 'Has +5 Attack while damaged.',
                modAttack: 5,
                modHealth: 0,
                isEnable: false,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @EventAgent.use(self => self.route.parent?.proxy.event.onStateChange)
    @TranxService.use()
    private handleHealthChange(that: RoleModel, event: Event.OnStateChange<RoleModel>) {
        const { next } = event;
        const isActive = next.curHealth < next.maxHealth;
        if (isActive === this.state.isActive) return;
        this.draft.state.isActive = isActive;
        this.reload();
    }

    @StateAgent.use(self => self.route.parent?.proxy.decor)
    private decorateRoleAttack(that: RoleModel, state: DeepReadonly<RoleModel.State>): DeepReadonly<RoleModel.State> {
        if (!this.state.isActive) return state;
        return {
            ...state,
            modAttack: state.modAttack + this.state.modAttack,
        }
    }

}