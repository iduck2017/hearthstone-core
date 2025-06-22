import { FeatureModel } from "@/common/feature";
import { RoleModel } from "@/common/role";
import { Event, EventAgent, StateAgent } from "set-piece";
import { DeepReadonly } from "utility-types";

export namespace AngryBirdEnrageModel {
    export type State = {
        buffAttack: number;
        buffHealth: number;
        isActive: boolean;
    }
    export type Event = {}
}

export class AngryBirdFeatureModel extends FeatureModel<
    RoleModel,
    AngryBirdEnrageModel.Event,
    AngryBirdEnrageModel.State
> {
    constructor(props: AngryBirdFeatureModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Angry Bird\'s Buff',
                desc: 'Has +5 Attack while damaged.',
                buffAttack: 5,
                buffHealth: 0,
                isActive: false,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @EventAgent.use(self => self.route.parent?.proxy.event.onStateChange)
    private handleHealthChange(that: RoleModel, event: Event.OnStateChange<RoleModel>) {
        const { prev, next } = event;
        const isActive = this.state.isActive;
        if (prev.curHealth !== next.curHealth) {
            if (prev.curHealth < prev.health && !this.state.isActive) this.draft.state.isActive = true;
            if (prev.curHealth >= prev.health && this.state.isActive) this.draft.state.isActive = false;
        }
        if (this.state.isActive !== isActive) this.reload();
    }

    @StateAgent.use(self => self.route.parent?.proxy.decor)
    private handleBuff(that: RoleModel, buff: DeepReadonly<RoleModel.State>): DeepReadonly<RoleModel.State> {
        if (!this.state.isActive) return buff;
        return {
            ...buff,
            attack: buff.attack + this.state.buffAttack,
            health: buff.health + this.state.buffHealth,
        }
    }

}