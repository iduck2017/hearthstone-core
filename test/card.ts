import { CardModel, ClassType, MinionCardModel, RarityType } from "../src";

export class WispModel extends MinionCardModel {
    constructor(props: WispModel['props'] & {
        state: Pick<CardModel.State, 'mana'>;
        child: Pick<MinionCardModel.Child, 'role'>;
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