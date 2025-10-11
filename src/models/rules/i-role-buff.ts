import { RoleAttackDecor, RoleAttackModel } from "./role-attack";
import { RoleHealthDecor, RoleHealthModel } from "./health";
import { FeatureModel, RoleModel } from "../..";
import { OperatorType } from "../../types/operator";
import { Model, StateUtil, TemplUtil } from "set-piece";

export namespace IRoleBuffModel {
    export type S = {
        readonly offset: Readonly<[number, number]>;
    };
    export type E = {};
    export type C = {};
    export type R = {};
}

export abstract class IRoleBuffModel<
    E extends Partial<IRoleBuffModel.E & FeatureModel.E> & Model.E = {},
    S extends Partial<IRoleBuffModel.S & FeatureModel.S> & Model.S = {},
    C extends Partial<IRoleBuffModel.C & FeatureModel.C> & Model.C = {},
    R extends Partial<IRoleBuffModel.R & FeatureModel.R> & Model.R = {}
> extends FeatureModel<
    E & IRoleBuffModel.E,
    S & IRoleBuffModel.S,
    C & IRoleBuffModel.C,
    R & IRoleBuffModel.R
> {
    public get route() {
        const result = super.route;
        return {
            ...result,
            role: result.list.find(item => item instanceof RoleModel)
        }
    }

    constructor(props: IRoleBuffModel['props'] & {
        uuid: string | undefined;
        state: S & IRoleBuffModel.S & Pick<FeatureModel.S, 'desc' | 'name'>,
        child: C,
        refer: R,
    }) {
        super({
            uuid: props.uuid,
            state: {
                isBoard: false,
                isActive: true,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }


    @StateUtil.on(self => self.modifyAttack)
    private listenAttack() {
        return this.route.role?.proxy.child.attack?.decor;
    }
    protected modifyAttack(that: RoleAttackModel, decor: RoleAttackDecor) {
        if (!this.state.isActive) return;
        decor.add({
            type: OperatorType.ADD,
            offset: this.state.offset[0],
            reason: this,
        });
    }


    @StateUtil.on(self => self.modifyHealth)
    private listenHealth() {
        return this.route.role?.proxy.child.health?.decor;
    }
    protected modifyHealth(that: RoleHealthModel, decor: RoleHealthDecor) {
        if (!this.state.isActive) return;
        decor.add({
            type: OperatorType.ADD,
            offset: this.state.offset[1],
            reason: this,
        });
    }
}
