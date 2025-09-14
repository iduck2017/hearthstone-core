import { EffectModel, SelectEvent, RoleModel, DamageModel, DamageEvent, DamageType, CardFeatureModel, CardModel } from "hearthstone-core";
import { DebugUtil, Event, EventUtil, Loader, LogLevel, Model, StoreUtil } from "set-piece";

@StoreUtil.is('counterspell-effect')
export class CounterspellFeatureModel extends CardFeatureModel {
    constructor(loader?: Loader<CounterspellFeatureModel>) {
        super(() => {
            const props = loader?.() ?? {}
            return {
                uuid: props.uuid,
                state: { 
                    name: "Counterspell's feature",
                    desc: "When your opponent casts a spell, Counter it.",
                    isActive: true,
                    ...props.state 
                },
                child: { ...props.child },
                refer: { ...props.refer } 
            }
        })
    }

    @EventUtil.on(self => self.route.game?.proxy.all(CardModel).event.toRun)
    private onPlay(that: CardModel, event: Event) {
        const secret = this.route.secret;
        if (!secret) return;
        const board = this.route.board;
        if (!board) return;
        const player = this.route.player;
        if (!player) return;
        const opponent = player.refer.opponent;
        if (that.route.player !== opponent) return;
        secret.child.dispose.active({
            source: secret,
            detail: this,
        }, true)
        event.cancel();
    }
}