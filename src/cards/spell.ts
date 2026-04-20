import { CardModel } from ".";
import { CostModel } from "../rules/cost";

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