import { EffectModel } from "../../../features/hooks/effect";

export class ArmorUpEffectModel extends EffectModel {
    constructor(props?: ArmorUpEffectModel['props']) {
        super({
            uuid: props?.uuid,
            state: {
                name: 'Armor Up\'s Effect',
                desc: 'Gain 2 Armor.',
            },
            child: { ...props?.child },
            refer: { ...props?.refer },
        })
    }

    protected async doRun(): Promise<void> {
        const player = this.route.player;
        if (!player) return;
        const armor = player.child.hero.child.armor;
        armor.gain(2);
    }

    public precheck() {
        return undefined;
    }
}