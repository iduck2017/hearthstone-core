import { EffectModel } from "@/common/feature/effect";
import { GameModel } from "@/common/game";
import { EventAgent, TranxService } from "set-piece";

export class AbusiveSergeantEffectModel extends EffectModel {
    constructor(props: AbusiveSergeantEffectModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Abusive Sergeant\'s Buff',
                desc: '+2 Attack this turn.',
                modAttack: 2,
                modHealth: 0,
                isEnable: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @EventAgent.use(self => self.route.game?.proxy.event.onTurnEnd)
    @TranxService.use()
    private handleTurnEnd(that: GameModel) {
        this.draft.state.isActive = false;
        this.reload();
    }
}
