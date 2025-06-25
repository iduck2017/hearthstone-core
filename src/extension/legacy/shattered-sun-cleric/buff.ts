import { FeatureModel } from "@/common/feature";
import { EffectModel } from "@/common/feature/effect";

export class ShatteredSunClericEffectModel extends EffectModel {
    constructor(props: ShatteredSunClericEffectModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Shattered Sun Cleric\'s Buff',
                desc: '+1/+1',
                modAttack: 1,
                modHealth: 1,
                isBuff: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}