import { DamageEvent, DamageModel, DamageType, DeathrattleModel } from "hearthstone-core";
import { Loader, StoreUtil } from "set-piece";

@StoreUtil.is('leper-gnome-deathrattle')
export class LeperGnomeDeathrattleModel extends DeathrattleModel {
    constructor(loader?: Loader<LeperGnomeDeathrattleModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Leper Gnome\'s Deathrattle',
                    desc: 'Deal 2 damage to the enemy hero.',
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
            }
        });
    }

    public async doRun() {
        const player = this.route.player;
        const card = this.route.card;
        if (!card) return;
        if (!player) return;
        const opponent = player.refer.opponent;
        if (!opponent) return;
        const target = opponent.child.hero.child.role;
        DamageModel.run([
            new DamageEvent({
                source: card,
                detail: this,
                target,
                origin: 2,
                type: DamageType.DEFAULT,
            }),
        ]);
    }
}