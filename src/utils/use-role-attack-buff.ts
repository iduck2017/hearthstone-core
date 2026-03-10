import { useRoute, Model, useMountHook, useUnmountHook, useWeakRef } from "set-piece";
import { AbstractConstructor, Constructor } from "set-piece/dist/types";
import { RoleModel } from "../entities/role";
import { MinionModel } from "../entities/minion";
import { NumberDecorModel, NumberDecorType } from "./number-decor";
import { HeroModel } from "../entities/hero";
import { useFeatDeactiveHook } from "./use-feat-deactive-hook";
import { FeatureModel } from "../features";

export function useRoleAttackBuff(value: number, type?: NumberDecorType) {
    return function(BaseModel: AbstractConstructor<FeatureModel>): any {
        class _RoleAttackBuffModel extends BaseModel {
            @useWeakRef()
            private _attackDecor?: NumberDecorModel;

            @useMountHook()
            private _handleAttackBuffMount() {
                const container = this.container;
                if (!container) return;
                const role = container.role;
                const attackDecor = new NumberDecorModel({
                    type: type ?? NumberDecorType.BUFF,
                    value: value,
                });
                role.attack.addDecor(attackDecor);
                this._attackDecor = attackDecor;
            }

            @useUnmountHook()
            @useFeatDeactiveHook()
            private _handleAttackBuffUnmount() {
                const container = this.container;
                if (!container) return;
                const role = container.role;
                if (!this._attackDecor) return;
                role.attack.removeDecor(this._attackDecor);
                this._attackDecor = undefined;
            }

        }
        return _RoleAttackBuffModel;
    }
}