import { BuffModel } from "@/common/feature/buff";
import { GameModel } from "@/common/game";
import { EventAgent } from "set-piece";

export class AbusiveSergeantBuffModel extends BuffModel {
    constructor(props: AbusiveSergeantBuffModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Abusive Sergeant\'s Buff',
                desc: '+2 Attack this turn.',
                buffAttack: 2,
                buffHealth: 0,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @EventAgent.use(self => self.route.game?.proxy.event.onTurnEnd)
    private onTurnEnd(that: GameModel) {
        this.draft.state.isActive = false;
    }
}
