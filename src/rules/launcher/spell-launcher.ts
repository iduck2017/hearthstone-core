import { Model, useDep, useModel, useRoute, useState } from "set-piece";
import { LauncherModel } from ".";
import { PlayerModel } from "../../entities/player";
import { SpellModel } from "../../cards/spell";
import { SpellEffectModel } from "../../feats/spell-effect";
import { SpellPlayPostEvent } from "../../event/spell-play";
import { CardLauncherModel } from "./card-launcher";

@useModel('spell-launcher')
export class SpellLauncherModel extends CardLauncherModel {
    protected _brand: symbol = Symbol('spell-launcher')

    @useRoute(() => SpellModel)
    protected _spell?: SpellModel

    @useDep()
    private _options?: Array<[SpellEffectModel, Array<Model | undefined>]>;

    @useState()
    private _currentIndex?: number;

    private async proceedCast(): Promise<boolean> {
        if (!this._options) return false;
        if (this._currentIndex === undefined) return false;
        const currentStep = this._options[this._currentIndex];
        if (!currentStep) return true;
        const [currentHook, currentParams] = currentStep;
        await currentHook.run(...currentParams);
        this._currentIndex += 1;
        return false;
    }

    private async prepareRun() {
        const spell = this._spell;
        if (!spell) return;
        const options: Array<[SpellEffectModel, Array<Model | undefined>]> = [];
        for (const hook of spell.spellEffects) {
            const params = await hook.getTargets();
            options.push([hook, params]);
        }
        return { options };
    }

    public async run() {
        if (!this.isPlayable) return;
        const player = this._player;
        if (!player) return;
        const spell = this._spell;
        if (!spell) return;
        const result = await this.prepareRun();
        if (!result) return;
        spell.consumeMana();
        spell.moveToWorkspace(player);
        this._options = result.options;
        this._currentIndex = 0;
        while (true) {
            const isFinished = await this.proceedCast();
            if (isFinished) break;
        }
        this._options = undefined;
        this._currentIndex = undefined;
        spell.moveToGraveyard();
        const postEvent = new SpellPlayPostEvent({ options: {}, result: undefined })
        this.emitDeferEvent(postEvent);
    }
}
