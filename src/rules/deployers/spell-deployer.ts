import { Event, Model, PrevEvent, useChild, useEventConsumer, useModel, useRoute } from "set-piece";
import { SpellModel } from "../../cards/spell";
import { CardDeployerModel } from "./card-deployer";
import { DeployIntensionModel } from "../deploy-intension";
import { PlayerModel } from "../../entities/player";

export class SpellPlayPrevEvent extends PrevEvent<{}> {
    protected _brand: symbol = Symbol('spell-play-prev-event');
}
export class SpellPlayPostEvent extends Event {
    protected _brand: symbol = Symbol('spell-play-post-event');
}

export function usePlayerSpellCast<I extends Model & { player: PlayerModel | undefined }>() {
    return function(
        prototype: I,
        key: string,
        descriptor: TypedPropertyDescriptor<(event: SpellPlayPostEvent) => void>
    ) {
        useEventConsumer((i: I) => {
            const cards = i.player?.cards ?? [];
            const deployers = cards.map(card => card.deployer);
            return [deployers, SpellPlayPostEvent]
        })(prototype, key, descriptor);
    }
}

@useModel('spell-deployer')
export class SpellDeployerModel extends CardDeployerModel {
    protected _brand: symbol = Symbol('spell-deployer')

    @useRoute(() => SpellModel)
    protected _spell?: SpellModel

    @useChild()
    private intensions?: DeployIntensionModel[];

    /** Move this card from workspace into the owning player's graveyard. */
    public dispose() {
        const player = this._player;
        if (!player) return;
        const card = this._card;
        if (!card) return;
        player.workspace?.removeCard(card);
        player.graveyard.addCard(card);
    }

    private async prepareLaunch() {
        const spell = this._spell;
        if (!spell) return;
        const intensions: DeployIntensionModel[] = [];
        for (const feat of spell.spellEffects) {
            const params = await feat.getTargets();
            const intension = new DeployIntensionModel({ feat, params });
            intensions.push(intension);
        }
        this.intensions = intensions;
        return true;
    }

    public async launch() {
        if (!this.isPlayable) return;
        const player = this._player;
        if (!player) return;
        const spell = this._spell;
        if (!spell) return;
        const isValid = await this.prepareLaunch();
        if (!isValid) return;
        spell.consumeMana();
        this.prepare(player);
        while (this.intensions?.length) {
            const intension = this.intensions.pop();
            await intension?.launch();
        }
        this.intensions = undefined;
        const postEvent = new SpellPlayPostEvent();
        this.dispose();
        this.emitDeferEvent(postEvent);
    }
}
