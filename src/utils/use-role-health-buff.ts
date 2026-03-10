import { useRoute, Model, useMountHook, useUnmountHook, useWeakRef } from "set-piece";
import { AbstractConstructor } from "set-piece/dist/types";
import { RoleModel } from "../entities/role";
import { MinionModel } from "../entities/minion";
import { NumberDecorModel, NumberDecorType } from "./number-decor";
import { HeroModel } from "../entities/hero";
import { useFeatDeactiveHook } from "./use-feat-deactive-hook";
import { FeatureModel } from "../features";

export function useRoleHealthBuff(value: number, type?: NumberDecorType) {
    return function(BaseModel: AbstractConstructor<FeatureModel>): any {
        class _RoleHealthBuffModel extends BaseModel {
            @useWeakRef()
            private _healthDecor?: NumberDecorModel;

            @useMountHook()
            private _handleHealthBuffMount() {
                const container = this.container;
                console.log('HandleMount', container);
                if (!container) return;
                const role = container.role;
                const healthDecor = new NumberDecorModel({
                    type: type ?? NumberDecorType.BUFF,
                    value: value,
                });
                role.health.addDecor(healthDecor);
                this._healthDecor = healthDecor;
            }

            @useUnmountHook()
            @useFeatDeactiveHook()
            private _handleHealthBuffUnmount() {
                console.log('HandleUnMount', value);
                const container = this.container;
                if (!container) return;
                const role = container.role;
                if (!this._healthDecor) return;
                role.health.removeDecor(this._healthDecor);
                this._healthDecor = undefined;
            }

        }
        return _RoleHealthBuffModel;
    }
}
