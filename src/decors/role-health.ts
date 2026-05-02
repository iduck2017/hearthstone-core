import { Decor, Model, useDecorConsumer } from "set-piece";
import { BuffOperator, BuffOperatorType } from "./role-attack";
import { RoleModel } from "../entities/role";
import { FeatModel, SubFeatModel, RoleFeatModel, BaseFeatModel } from "../feats";
import { PlayerModel } from "../entities/player";

export class RoleHealthDecor extends Decor<number> {
    private _operators: BuffOperator[] = [];

    public addBuff(buff: BuffOperator) {
        this._operators.push(buff);
    }

    public get result() {
        let origin = this.origin;
        this._operators.sort((opA, opB) => {
            if (opA.type === BuffOperatorType.AURA) return 1;
            return opA.source.uuid.localeCompare(opB.source.uuid);
        })
        this._operators.forEach(op => {
            switch(op.type) {
                case BuffOperatorType.COMMON:
                case BuffOperatorType.AURA:
                    origin += op.value;
                    break;
                case BuffOperatorType.RESET:
                    origin = op.value;
                    break;
                default: break;
            }
        })
        return origin;
    }
}


export function useRoleHealthDecorConsumer<F extends RoleFeatModel>() {
    return function(
        prototype: F,
        key: string,
        descriptor: TypedPropertyDescriptor<(decor: RoleHealthDecor) => void>
    ) {
        useDecorConsumer((that: F) => {
            const role = that.role;
            if (!role) return;
            if (!that.feat?.isActived) return;
            return [role.health, RoleHealthDecor]
        })(prototype, key, descriptor);
    }
}


// Subscribes to the RoleHealthDecor of every allied minion on the board.
// The handler is called once per ally; use this to apply aura buffs to all friendly minions.
export function useAllyRoleHealthDecorConsumer<F extends BaseFeatModel>() {
    return function(
        prototype: F,
        key: string,
        descriptor: TypedPropertyDescriptor<(decor: RoleHealthDecor) => void>
    ) {
        useDecorConsumer((that: F) => {
            const minions = that.player?.board.minions;
            if (!minions) return;
            const feats = minions.map(minion => minion.role.health);
            if (!that.feat?.isActived) return [undefined, RoleHealthDecor];
            else return [feats, RoleHealthDecor]
        })(prototype, key, descriptor);
    }
}