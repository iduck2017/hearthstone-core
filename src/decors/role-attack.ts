import { number } from "joi";
import { Decor, Model, useDecorConsumer } from "set-piece";
import { RoleModel } from "../entities/role";
import { FeatModel, RoleFeatureModel } from "../feats";

export enum BuffOperatorType {
    COMMON = 'common',
    AURA = 'aura',
    RESET = 'reset'    
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


export function useRoleAttackDecorConsumer<I extends RoleFeatureModel>() {
    return function(
        prototype: I,
        key: string,
        descriptor: TypedPropertyDescriptor<(decor: RoleAttackDecor) => void>
    ) {
        useDecorConsumer((i: I) => [
            i.feat?.isActived ? i.role?.attack : undefined,
            RoleAttackDecor
        ])(
            prototype,
            key,
            descriptor
        );
    }
}