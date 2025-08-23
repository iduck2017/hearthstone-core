import { CardModel, ClassType, MinionModel, RarityType } from "../src";

export class WispModel extends MinionModel {
    constructor(props: WispModel['props'] & {
        child: Pick<MinionModel.Child, 'role'> & Pick<CardModel.Child, 'cost'>;
    }) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Wisp',
                desc: '',
                flavorDesc: '',
                rarity: RarityType.COMMON,
                class: ClassType.NEUTRAL,
                races: [],
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}