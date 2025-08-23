import { FeatureModel } from "../features";

export namespace SpellDamageModel {
    export type Event = {};
    export type State = {
        origin: number;
    };
    export type Child = {};
    export type Refer = {};
}

export class SpellDamageModel extends FeatureModel<
    SpellDamageModel.Event,
    SpellDamageModel.State,
    SpellDamageModel.Child,
    SpellDamageModel.Refer
> {
    constructor(props: SpellDamageModel['props'] & {
        state: Pick<SpellDamageModel.State, 'origin'>
    }) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Spell Damage',
                desc: 'Your spell cards deal extra damage.',
                status: 1,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }


}