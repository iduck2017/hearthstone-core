import { useModel } from "set-piece";
import { BattlecryModel, useBattlecryLaunchHook } from "../../../feats/battlecry";
import { RaceType } from "../../../utils/enums";
import { MinionModel } from "../../minion";

@useModel('captains-parrot-battlecry-model')
export class CaptainsParrotBattlecryModel extends BattlecryModel<never> {
    protected _brand: symbol = Symbol('captains-parrot-battlecry-model');

    @useBattlecryLaunchHook()
    protected async handleRun(): Promise<void> {
        const player = this.player;
        if (!player) return;
        const cards = player.deck.cards;
        const minions = cards.filter(card => card instanceof MinionModel);
        const pirates = minions.filter(card => card.races.includes(RaceType.PIRATE));
        if (pirates.length === 0) return;
        const index = Math.floor(Math.random() * pirates.length);
        const pirate = pirates[index];
        player.drawCard(pirate);
    }
}
