import { EventAgent, Model, Event, StateAgent } from "set-piece";
import { FeatureModel } from ".";
import { RootModel } from "../root";
import { GameModel } from "../game";
import { PlayerModel } from "../player";
import { CardModel } from "../card";
import { RoleModel } from "../role";
import { MinionCardModel } from "../card/minion";
import { DeepReadonly } from "utility-types";

export namespace BuffModel {
    export type State = Partial<FeatureModel.State> & {
        buffAttack: number;
        buffHealth: number;
        isValid: boolean;
        isActive: boolean;
    }
    export type Event = Partial<FeatureModel.Event> & {};
    export type Child = Partial<FeatureModel.Child> & {};
    export type Refer = Partial<FeatureModel.Refer> & {};
}

export class BuffModel<
    P extends RoleModel = RoleModel,
    E extends Partial<BuffModel.Event> & Model.Event = {},
    S extends Partial<BuffModel.State> & Model.State = {},
    C extends Partial<BuffModel.Child> & Model.Child = {},
    R extends Partial<BuffModel.Refer> & Model.Refer = {}
> extends FeatureModel<
    P,
    E & BuffModel.Event,
    S & BuffModel.State,
    C & BuffModel.Child,
    R & BuffModel.Refer
> {
    constructor(props: BuffModel['props'] & {
        state: S & 
            Pick<BuffModel.State, 'buffAttack' | 'buffHealth'> & 
            Pick<FeatureModel.State, 'name' | 'desc'>;
        child: C;
        refer: R;
    }) {
        super({
            uuid: props.uuid,
            state: {
                isValid: true,
                isActive: true,
                ...props.state,
            },
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
    private handleBuff(that: RoleModel, buff: DeepReadonly<RoleModel.State>): DeepReadonly<RoleModel.State> {
        console.warn('handleBuff', this.state.isValid, this.state.isActive);
        if (!this.state.isValid) return buff;
        if (!this.state.isActive) return buff;
        return {
            ...buff,
            attack: buff.attack + this.state.buffAttack,
            health: buff.health + this.state.buffHealth,
        }
    }

    @EventAgent.use(self => self.proxy.event.onStateChange)
    private handleStateChange(that: BuffModel, event: Event.OnStateChange<BuffModel>) {
        const { prev, next } = event;
        if (prev.isActive !== next.isActive) this.reload();
        if (prev.buffAttack !== next.buffAttack) this.reload();
        if (prev.buffHealth !== next.buffHealth) this.reload();
    }

    @EventAgent.use(self => self.route.role?.proxy.event.onResetBefore)
    private handleHealthReset(that: RoleModel, event: RoleModel.Event['onResetBefore']) {
        this.draft.state.isValid = false;
    }
}