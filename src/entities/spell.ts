import { asTransaction } from "set-piece";
import { CostModel } from "../rules/cost";
import { CardModel } from "./card";

export class SpellModel extends CardModel {
    public get source() {
        return this.hand ?? this.deck;
    }

    constructor(props?: {
        cost?: CostModel;
    }) {
        super({
            cost: new CostModel({
                origin: 0,
            }),
        });
    }

    public get isDisposable() {
        return true;
    }
    @asTransaction()
    public dispose(): void {
        if (!this.isDisposable) return;
        
        const player = this.player;
        if (!player) {
            console.error('Player not found');
            return;
        }
        this.source?.delCard(this);
        player.graveyard.disposeCard(this);
    }

    public async play(): Promise<void> {}
}