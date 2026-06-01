import { AppModel } from "../../../app";
import { GameModel } from "../../../entities/game";
import { PlayerModel } from "../../../entities/player";
import { DeckModel } from "../../../entities/deck";
import { BoardModel } from "../../../entities/board";
import { HandModel } from "../../../entities/hand";
import { MageModel } from "../../../heroes/mage";
import { sleep } from "../../../utils/sleep";
import { CaptainsParrotModel } from "./index";
import { SouthseaDeckhandModel } from "../southsea-deckhand";
import { WispModel } from "../wisp";
import { ManaModel } from "../../../rules/mana";

describe('captains-parrot', () => {
    const app = new AppModel();
    const parrot = new CaptainsParrotModel();
    const deckhand = new SouthseaDeckhandModel();
    const wisp = new WispModel();

    const game = new GameModel({
        playerA: new PlayerModel({
            hero: new MageModel(),
            hand: new HandModel({
                cards: [parrot],
            }),
            deck: new DeckModel({
                cards: [deckhand, wisp],
            }),
            mana: new ManaModel({ maximum: 10 })
        }),
        playerB: new PlayerModel({
            hero: new MageModel(),
        }),
    });

    const playerA = game.playerA;

    if (!parrot) throw new Error('Parrot not found');
    if (!deckhand) throw new Error('Deckhand not found');
    if (!wisp) throw new Error('Wisp not found');

    app.setGame(game);
    game.start({ isInitPhaseIgnored: true });

    it('check-initial-state', () => {
        expect(playerA.hand.cards.length).toBe(1);
        expect(playerA.hand.cards).toContain(parrot);
        expect(playerA.deck.cards.length).toBe(2);
        expect(playerA.deck.cards).toContain(deckhand);
        expect(playerA.deck.cards).toContain(wisp);
    });

    it('play-captains-parrot-draws-pirate', async () => {
        parrot.deployer.launch();
        await sleep();
        playerA.controller.selectTarget(0);
        await sleep();
        expect(playerA.hand.cards.length).toBe(1);
        expect(playerA.hand.cards).toContain(deckhand);
        expect(playerA.deck.cards.length).toBe(1);
        expect(playerA.deck.cards).toContain(wisp);
    });
});
