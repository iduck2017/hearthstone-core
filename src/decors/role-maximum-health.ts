import { Decor, useDecorConsumer } from "set-piece";
import { BuffOperator, BuffOperatorType } from "./role-current-attack";
import { RoleModel } from "../entities/role";
import { RoleHealthModel } from "../rules/role-health";
import { FeatureModel } from "../features";

export class RoleMaximumHealthDecor extends Decor<number> {
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


export function useRoleMaximumHealthDecorConsumer<I extends FeatureModel & { role: RoleModel | undefined }>() {
    return function(
        prototype: I,
        key: string,
        descriptor: TypedPropertyDescriptor<(decor: RoleMaximumHealthDecor, target: RoleHealthModel) => void>
    ) {
        useDecorConsumer((i: I) => [i.isActived ? i.role?.health : undefined, RoleMaximumHealthDecor])(
            prototype,
            key,
            descriptor
        );
        const handler = descriptor.value;
        if (!handler) return;  
        descriptor.value = function(this: I,  decor: RoleMaximumHealthDecor, target: RoleHealthModel) {
            handler.call(this, decor, target);
        }
        return descriptor;
    }
}