import { Decor, Model, useDecorConsumer } from "set-piece";
import { BuffOperator, BuffOperatorType } from "./role-attack";
import { RoleModel } from "../entities/role";
import { FeatModel, BaseFeatModel } from "../feats";
import { PlayerModel } from "../entities/player";

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


export function useRoleHealthDecorConsumer<F extends Model & {
    feat: FeatModel | undefined,
    role: RoleModel | undefined
}>() {
    return function(
        prototype: F,
        key: string,
        descriptor: TypedPropertyDescriptor<(decor: RoleHealthDecor) => void>
    ) {
        useDecorConsumer((i: F) => [
            i.feat?.isActived ? i.role?.health : undefined,
            RoleHealthDecor
        ])(
            prototype,
            key,
            descriptor
        );
    }
}


// Subscribes to the RoleHealthDecor of every allied minion on the board.
// The handler is called once per ally; use this to apply aura buffs to all friendly minions.
export function useAllyRoleHealthDecorConsumer<F extends Model & {
    player: PlayerModel | undefined
    feat: FeatModel | undefined
}>() {
    return function(
        prototype: F,
        key: string,
        descriptor: TypedPropertyDescriptor<(decor: RoleHealthDecor) => void>
    ) {
        useDecorConsumer((feat: F) => {
            const minions = feat.player?.board.minions;
            const feats = minions?.map(minion => minion.role.health);
            if (!feat.feat?.isActived) return [undefined, RoleHealthDecor];
            else return [feats, RoleHealthDecor]
        })(
            prototype,
            key,
            descriptor
        );
    }
}