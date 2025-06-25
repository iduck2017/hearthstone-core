import { EventAgent, Model, Event, StateAgent } from "set-piece";
import { FeatureModel } from ".";
import { GameModel } from "../game";
import { PlayerModel } from "../player";
import { CardModel } from "../card";
import { RoleModel } from "../role";
import { MinionCardModel } from "../card/minion";
import { DeepReadonly } from "utility-types";

export namespace EffectModel {
    export type State = Partial<FeatureModel.State> & {
        modAttack: number;
        modHealth: number;
        isBuff: boolean;
    }
    export type Event = Partial<FeatureModel.Event> & {};
    export type Child = Partial<FeatureModel.Child> & {};
    export type Refer = Partial<FeatureModel.Refer> & {};
}

export class EffectModel<
    P extends RoleModel = RoleModel,
    E extends Partial<EffectModel.Event> = {},
    S extends Partial<EffectModel.State> = {},
    C extends Partial<EffectModel.Child> & Model.Child = {},
    R extends Partial<EffectModel.Refer> & Model.Refer = {}
> extends FeatureModel<
    P,
    E & EffectModel.Event,
    S & EffectModel.State,
    C & EffectModel.Child,
    R & EffectModel.Refer
> {
    constructor(props: EffectModel['props'] & {
        state: S & EffectModel.State & Pick<FeatureModel.State, 'name' | 'desc'>;
        child: C;
        refer: R;
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        })
    }

    public get route(): Readonly<Partial<{
        parent: P;
        role: RoleModel;
        card: MinionCardModel;
        root: Model;
        game: GameModel;
        owner: PlayerModel;
        opponent: PlayerModel;
    }>>{
        const route = super.route;
        const role = route.parent;
        const card = role?.route.parent instanceof CardModel ? role.route.parent : undefined;
        const owner = card?.route.owner;
        return {
            ...route,
            owner,
            opponent: owner?.route.opponent,
            role,
            card,
        }
    }

    @StateAgent.use(self => self.route.role?.proxy.decor)
    private handleBuff(that: RoleModel, state: DeepReadonly<RoleModel.State>): DeepReadonly<RoleModel.State> {
        if (!this.state.isBuff) return state;
        return {
            ...state,
            attack: state.attack + this.state.modAttack,
            maxHealth: state.maxHealth + this.state.modHealth,
            tmpHealth: state.tmpHealth + Math.max(0, this.state.modHealth),
        }
    }

    @EventAgent.use(self => self.proxy.event.onStateChange)
    private handleStateChange(that: EffectModel, event: Event.OnStateChange<EffectModel>) {
        const { prev, next } = event;
        if (prev.isBuff !== next.isBuff) this.reload();
        if (prev.modAttack !== next.modAttack) this.reload();
        if (prev.modHealth !== next.modHealth) this.reload();
    }

}