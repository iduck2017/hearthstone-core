import { asRoute, onMount, onUnmount } from "set-piece";
import { FeatureModel } from "../../../features";
import { RoleModel } from "../../../entities/role";
import { NumberDecorModel, NumberDecorType } from "../../../utils/number-decor";
import { MinionModel } from "../../../entities/minion";
import { HeroModel } from "../../../entities/hero";

export class ShatteredSunClericBuffModel extends FeatureModel {
    public deactive(): void {}

    @asRoute(() => MinionModel)
    private _minion?: MinionModel;

    @asRoute(() => HeroModel)
    private _hero?: HeroModel;

    private get container() {
        return this._minion ?? this._hero;
    }

    private _decors?: [NumberDecorModel, NumberDecorModel];

    @onMount()
    private handleMount() {
        const container = this.container;
        if (!container) return;
        const role = container.role;

        const healthDecor = new NumberDecorModel({
            type: NumberDecorType.BUFF,
            value: 1,
        });
        const attackDecor = new NumberDecorModel({
            type: NumberDecorType.BUFF,
            value: 1,
        });
        role.health.addDecor(healthDecor);
        role.attack.addDecor(attackDecor);
        this._decors = [healthDecor, attackDecor];
    }

    @onUnmount()
    private handleUnmount() {
        const container = this.container;
        if (!container) return;
        const role = container.role;

        if (!this._decors) return;
        const [healthDecor, attackDecor] = this._decors;    

        if (!healthDecor || !attackDecor) return;
        role.health.removeDecor(healthDecor);
        role.attack.removeDecor(attackDecor);
    }
}