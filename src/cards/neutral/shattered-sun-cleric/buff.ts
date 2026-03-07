import { asRoute, onMount, onUnmount } from "set-piece";
import { FeatureModel } from "../../../features";
import { RoleModel } from "../../../entities/role";
import { RoleHealthDecorModel, RoleHealthDecorType } from "../../../rules/role-health-decor";
import { RoleAttackDecorModel, RoleAttackDecorType } from "../../../rules/role-attack-decor";
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

    // @asWeakReferList
    private _decors?: [RoleHealthDecorModel, RoleAttackDecorModel];

    @onMount()
    private handleMount() {
        const container = this.container;
        if (!container) return;
        const role = container.role;
        console.log('handleMount', container, role);

        const healthDecor = new RoleHealthDecorModel({
            type: RoleHealthDecorType.BUFF,
            value: 1,
        });
        const attackDecor = new RoleAttackDecorModel({
            type: RoleAttackDecorType.BUFF,
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