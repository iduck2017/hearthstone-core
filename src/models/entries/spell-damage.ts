import { Event } from "set-piece";
import { FeatureModel, FeatureStatus } from "../features";

export namespace SpellDamageProps {
    export type E = {
        onActive: Event;
    };
    export type S = {
        origin: number;
    };
    export type C = {};
    export type R = {};
}

export class SpellDamageModel extends FeatureModel<
    SpellDamageProps.E,
    SpellDamageProps.S,
    SpellDamageProps.C,
    SpellDamageProps.R
>  {
    constructor(props: SpellDamageModel['props'] & {
        state: Pick<SpellDamageProps.S, 'origin'>
    }) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Spell Damage',
                desc: 'Your spell cards deal extra damage.',
                status: FeatureStatus.ACTIVE,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}