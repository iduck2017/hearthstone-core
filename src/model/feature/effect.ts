import { Model, StateAgent, TranxService } from "set-piece";
import { FeatureModel } from ".";
import { GameModel } from "../game";
import { PlayerModel } from "../player";
import { CardModel } from "../card";
import { RoleModel } from "../role";
import { MinionCardModel } from "../card/minion";
import { DeepReadonly } from "utility-types";
import { Optional } from "../../types";

export namespace EffectModel {
    export type State = Partial<FeatureModel.State> & {
        modAttack: number;
        modHealth: number;
        isEnable: boolean;
        isActive: boolean;
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
        state: S 
            & Pick<EffectModel.State, 'modAttack' | 'modHealth' | 'isEnable'> 
            & Pick<FeatureModel.State, 'name' | 'desc'>;
        child: C;
        refer: R;
    }) {
        super({
            uuid: props.uuid,
            state: {
                isActive: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        })
    }

    public get route(): Readonly<Optional<{
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
            parent: route.parent,
            root: card?.route.root,
            game: card?.route.game,
            owner,
            opponent: owner?.route.opponent,
            role,
            card,
        }
    }

    @StateAgent.use(self => {
        if (!self.state.isEnable) return;
        if (!self.state.isActive) return;
        return self.route.role?.proxy.decor;
    })
    private decorateRoleState(that: RoleModel, state: DeepReadonly<RoleModel.State>): DeepReadonly<RoleModel.State> {
        if (!this.state.isEnable) return state;
        if (!this.state.isActive) return state;
        return {
            ...state,
            modAttack: state.modAttack + this.state.modAttack,
            modHealth: state.modHealth + this.state.modHealth,
        }
    }

    @TranxService.use()
    public reset() {
        this.draft.state.isEnable = false;
        this.reload();
    }
}