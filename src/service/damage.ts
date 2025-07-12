import { TranxUtil } from "set-piece";
import { RoleModel } from "src/model/role"

export type DamageCmd = {
    target: RoleModel;
    source: RoleModel;
    damage: number;
}

export class DamageUtil {
    private constructor() {}

    private static _isLock = false;

    public static toRun(queue: DamageCmd[]) {
        this._isLock = true;
        DamageUtil.run(queue);
        queue.forEach(item => {
            const { target, damage, source } = item;
            if (!damage) return;
            item.target.onRecvDamage({ source, damage });
            item.target.onDealDamage({ target, damage })
        });
        this._isLock = false;
    }

    @TranxUtil.span()
    private static run(queue: DamageCmd[]) {
        queue.forEach(item => {
            const { damage, source, target } = item;
            const prevState = { ...target.state };
            item.damage = target.recvDamage({ damage, source });
        })
    }
}