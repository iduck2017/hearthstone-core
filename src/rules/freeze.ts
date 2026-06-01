import { useModel, useRoute } from "set-piece";
import { FeatModel } from "../feats";
import { TurnEndPostEvent, useTurnEndEventConsumer } from "../entities/game";
import { RoleModel } from "..";

@useModel('freeze-model')
export class FreezeModel extends FeatModel {
    protected _brand: symbol = Symbol('freeze-model');

    @useRoute(() => RoleModel)
    private _role?: RoleModel

    public check() {
        if (!this.isActived) return;
        if (!this._role) return;
        const action = this._role.action;
        if (!action.current) return;
        this.disable();
    }
}
