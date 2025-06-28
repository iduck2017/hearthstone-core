import { EffectModel } from "@/common/feature/effect";
import { RoleModel } from "@/common/role";
import { MinionRoleModel } from "@/common/role/minion";
import { MinionRaceType } from "@/types/card";
import { CheckService, DebugService, LogLevel, StateAgent, TranxService } from "set-piece";
import { DeepReadonly } from "utility-types";

export namespace GrimscaleOracleEffectModel {
    export type Event = Partial<EffectModel.Event>;
    export type State = Partial<EffectModel.State> & {
        readonly isEnable: false;
    };
}

export class GrimscaleOracleEffectModel extends EffectModel<
    MinionRoleModel
> {
    constructor(props: GrimscaleOracleEffectModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Grimscale Oracle\'s Aura',
                desc: 'Your other Murlocs have +1 Attack.',
                modAttack: 1,
                modHealth: 0,
                isEnable: false,
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer }
        });
    }

    @StateAgent.use(self => self.route.owner?.proxy.child.board.child.cards.child.role.decor)
    @DebugService.log(LogLevel.WARN)
    private decorateRoleAttack(
        that: MinionRoleModel, 
        state: DeepReadonly<MinionRoleModel.State & RoleModel.State>
    ): DeepReadonly<MinionRoleModel.State & RoleModel.State> {
        if (!this.route.parent?.route.board) return state;
        if (!that.state.races.includes(MinionRaceType.MURLOC)) return state;
        if (!this.state.isActive) return state;
        // console.log('that', that.name, that.state)
        return {
            ...state,
            modAttack: state.modAttack + this.state.modAttack,
        }
    }
}