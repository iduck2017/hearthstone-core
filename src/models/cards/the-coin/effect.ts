import { TemplUtil } from "set-piece";
import { SpellEffectModel } from "../../features/hooks/spell-effect";

@TemplUtil.is('the-coin-effect')
export class TheCoinEffectModel extends SpellEffectModel<[]> {
    constructor(props?: TheCoinEffectModel['props']) {
        props = props ?? {};
        super({
            uuid: props.uuid,
            state: {
                name: "The Coin's effect",
                desc: "Gain 1 Mana Crystal this turn only.",
                damage: [0],
                ...props.state
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    toRun(): [] { return []; }

    protected async doRun(): Promise<void> {
        const player = this.route.player;
        if (!player) return;
        player.child.mana.restore(1);
    }
}   