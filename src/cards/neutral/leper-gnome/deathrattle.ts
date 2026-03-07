import { DeathrattleModel } from "../../../hooks/deathrattle";

export class LeperGnomeDeathrattleModel extends DeathrattleModel {
    protected _run(): void {
        const player = this.player;
        const opponent = player?.opponent;
        if (!opponent) return;
        console.log('Leper gnome deathrattle', opponent.hero);
        opponent.hero.role.receiveDamage({
            value: 2,
        })
    }
}   