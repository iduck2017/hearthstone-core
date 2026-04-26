import { SpellEffectModel } from "../../../feats/spell-effect";
import { Selector } from "../../../utils/controller";
import { RoleModel } from "../../../entities/role";
import { useSpellEffectRunHook } from "../../../hooks/spell-effect-run";
import { useDecorProducer, useState, useModel } from "set-piece";
import { SpellDamageDecor } from "../../../decors/spell-damage";

@useModel('fireball-effect-model')
export class FireballEffectModel extends SpellEffectModel<RoleModel> {
    protected _brand: symbol = Symbol('fireball-effect-model');
    @useState()
    @useDecorProducer(() => SpellDamageDecor)
    private _damage: number = 6;


    public getSelector(): Selector<RoleModel> | undefined {
        const player = this.player;
        const opponent = player?.opponent;
        if (!player || !opponent) return;
        const options = [
            ...player.board.minions,
            ...opponent.board.minions,
            player.hero,
            opponent.hero,
        ].map(c => c.role);
        return { options };
    }

    @useSpellEffectRunHook()
    protected async handleRun(target?: RoleModel): Promise<void> {
        if (!target) return;
        this.entity?.damageSource.dealDamage({ target, value: this._damage });
    }

}
