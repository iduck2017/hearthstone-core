import { FeatureModel } from "@/common/feature";
import { BuffModel } from "@/common/feature/buff";

export class ShatteredSunClericBuffModel extends BuffModel {
    constructor(props: ShatteredSunClericBuffModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Shattered Sun Cleric\'s Buff',
                desc: '+1/+1',
                buffAttack: 1,
                buffHealth: 1,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}