import { CardModel, MinionCardModel } from "../../src";

export class WispCardModel extends MinionCardModel {
    constructor(props: WispCardModel['props'] & {
        state: Pick<CardModel.State, 'mana'>;
        child: Pick<MinionCardModel.Child, 'role'>;
    }) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Wisp',
                desc: '',
                races: [],
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}