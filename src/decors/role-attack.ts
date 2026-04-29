import { number } from "joi";
import { Decor, Model, useDecorConsumer } from "set-piece";
import { RoleModel } from "../entities/role";
import { FeatModel, SubFeatModel } from "../feats";
import { PlayerModel } from "../entities/player";

export enum BuffOperatorType {
    AURA = 'aura',
    RESET = 'reset',
    COMMON = 'common',
}

export interface BuffOperator {
    value: number;
    type: BuffOperatorType;
    source: Model;
}


export class RoleAttackDecor extends Decor<number> {
    private _operators: BuffOperator[] = [];

    public addBuff(buff: BuffOperator) {
        this._operators.push(buff);
    }

    public get result() {
        let origin = this.origin;
        this._operators.sort((opA, opB) => opA.source.uuid.localeCompare(opB.source.uuid))
        this._operators
            .filter(op => op.type !== BuffOperatorType.AURA)
            .forEach(op => {
                switch(op.type) {
                    case BuffOperatorType.COMMON: 
                        origin += op.value;
                        break;
                    case BuffOperatorType.RESET:
                        origin = op.value;
                        break;
                    default:
                        break;
                }
            })
        this._operators
            .filter(op => op.type === BuffOperatorType.AURA)
            .forEach(op => origin += op.value)
        return origin;
    }
}


export function useRoleAttackDecorConsumer<F extends Model & {
    feat: FeatModel | undefined,
    role: RoleModel | undefined
}>() {
    return function(
        prototype: F,
        key: string,
        descriptor: TypedPropertyDescriptor<(decor: RoleAttackDecor) => void>
    ) {
        useDecorConsumer((feat: F) => [
            feat.feat?.isActived ? feat.role?.attack : undefined,
            RoleAttackDecor
        ])(
            prototype,
            key,
            descriptor
        );
    }
}

// Subscribes to the RoleAttackDecor of every allied minion on the board.
// The handler is called once per ally; use this to apply aura buffs to all friendly minions.
export function useAllyRoleAttackDecorConsumer<F extends Model & {
    player: PlayerModel | undefined
    feat: FeatModel | undefined
}>() {
    return function(
        prototype: F,
        key: string,
        descriptor: TypedPropertyDescriptor<(decor: RoleAttackDecor) => void>
    ) {
        useDecorConsumer((feat: F) => {
            const minions = feat.player?.board.minions;
            const feats = minions?.map(minion => minion.role.attack);
            if (!feat.feat?.isActived) return [undefined, RoleAttackDecor];
            else return [feats, RoleAttackDecor]
        })(
            prototype,
            key,
            descriptor
        );
    }
}