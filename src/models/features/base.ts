import { FeatureModel } from ".";

export class BaseFeatureModel extends FeatureModel {
    constructor(props?: BaseFeatureModel['props']) {
        props = props ?? {}
        super({
            uuid: props.uuid,
            state: { 
                name: 'Unknown Feature',
                desc: '',
                isEnabled: true,
                ...props.state 
            },
            child: { 
                buffs: [], 
                ...props.child,
            },
            refer: { ...props.refer }
        })
    }
}