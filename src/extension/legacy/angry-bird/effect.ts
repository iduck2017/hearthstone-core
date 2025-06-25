import { FeatureModel } from "@/common/feature";
import { EffectModel } from "@/common/feature/effect";
import { RoleModel } from "@/common/role";
import { Event, EventAgent, StateAgent } from "set-piece";
import { DeepReadonly } from "utility-types";

export namespace AngryBirdEffectModel {
    export type State = Partial<FeatureModel.State> & {
        readonly isBuff: false;
        isEnrage: boolean;
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
                isEnrage: false,
                isBuff: false,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @EventAgent.use(self => self.route.parent?.proxy.event.onStateChange)
    private handleHealthChange(that: RoleModel, event: Event.OnStateChange<RoleModel>) {
        const { next } = event;
        const { isEnrage } = this.state;
        if (next.isEnrage && !isEnrage) this.draft.state.isEnrage = true;
        if (!next.isEnrage && isEnrage) this.draft.state.isEnrage = false;
        if (this.state.isEnrage !== isEnrage) this.reload();
    }

    @StateAgent.use(self => self.route.parent?.proxy.decor)
    private handleAura(that: RoleModel, buff: DeepReadonly<RoleModel.State>): DeepReadonly<RoleModel.State> {
        if (!this.state.isEnrage) return buff;
        return {
            ...buff,
            attack: buff.attack + this.state.modAttack,
        }
    }

}