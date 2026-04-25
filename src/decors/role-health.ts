import { Decor, useDecorConsumer } from "set-piece";
import { BuffOperator, BuffOperatorType } from "./role-attack";
import { RoleModel } from "../entities/role";
import { FeatModel, RoleFeatureModel } from "../feats";

export class RoleHealthDecor extends Decor<number> {
    private _operators: BuffOperator[] = [];

    public addBuff(buff: BuffOperator) {
        this._operators.push(buff);
    }

    public get result() {
        let origin = this.origin;
        this._operators.sort((buffA, buffB) => buffA.source.uuid.localeCompare(buffB.source.uuid))
        this._operators
            .filter(buff => buff.type !== BuffOperatorType.AURA)
            .forEach(buff => {
                switch(buff.type) {
                    case BuffOperatorType.COMMON: 
                        origin += buff.value;
                        break;
                    case BuffOperatorType.RESET:
                        origin = buff.value;
                        break;
                    default:
                        break;
                }
            })
        this._operators
            .filter(buff => buff.type === BuffOperatorType.AURA)
            .forEach(buff => origin += buff.value)
        return origin;
    }
}


export function useRoleHealthDecorConsumer<I extends RoleFeatureModel>() {
    return function(
        prototype: I,
        key: string,
        descriptor: TypedPropertyDescriptor<(decor: RoleHealthDecor) => void>
    ) {
        useDecorConsumer((i: I) => [
            i.feat?.isActived ? i.role?.health : undefined, 
            RoleHealthDecor
        ])(
            prototype,
            key,
            descriptor
        );
    }
}