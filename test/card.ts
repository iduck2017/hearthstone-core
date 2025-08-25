import { CardModel, ClassType, RarityType } from "../src";

export class WispModel extends CardModel {
    constructor(props: WispModel['props'] & {
        child: Pick<CardModel.Child, 'cost' | 'minion'>;
    }) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Wisp',
                desc: '',
                flavorDesc: '',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                isCollectible: false,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}