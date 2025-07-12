import { CardType } from "src/types/card";
import { CardModel } from "../card";
import { MinionCardModel } from "../card/minion";

export class DemoCardModel extends MinionCardModel {
    constructor(props: DemoCardModel['props'] & {
        state: Pick<CardModel.State, 'mana'>,
        child: Pick<MinionCardModel.Child, 'role'>
    }) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Demo',
                desc: '',
                type: CardType.MINION,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}