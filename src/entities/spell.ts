import { useTrx } from "set-piece";
import { CostModel } from "../rules/cost";
import { CardModel } from "../cards";

export abstract class SpellModel extends CardModel {
    constructor(props?: {
        cost?: CostModel;
    }) {
        super({
            cost: new CostModel({
                origin: 0,
            }),
        });
    }

    public async play(): Promise<void> {}
}