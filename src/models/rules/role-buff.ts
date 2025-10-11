import { RoleAttackDecor, RoleAttackModel } from "./role-attack";
import { RoleHealthDecor, RoleHealthModel } from "./health";
import { FeatureModel, RoleModel } from "../..";
import { OperationType } from "../../types/decor";
import { Model, StateUtil, TemplUtil } from "set-piece";

export namespace RoleBuffModel {
    export type S = {
        readonly offset: Readonly<[number, number]>;
    };
    export type E = {};
    export type C = {};
    export type R = {};
}

export abstract class IRoleBuffModel<
    E extends Partial<RoleBuffModel.E & FeatureModel.E> & Model.E = {},
    S extends Partial<RoleBuffModel.S & FeatureModel.S> & Model.S = {},
    C extends Partial<RoleBuffModel.C & FeatureModel.C> & Model.C = {},
    R extends Partial<RoleBuffModel.R & FeatureModel.R> & Model.R = {}
> extends FeatureModel<
    E & RoleBuffModel.E,
    S & RoleBuffModel.S,
    C & RoleBuffModel.C,
    R & RoleBuffModel.R
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
        state: S & RoleBuffModel.S & Omit<FeatureModel.S, 'isActive'>,
        child: C,
        refer: R,
    }) {
        super({
            uuid: props.uuid,
            state: {
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
            type: OperationType.ADD,
            value: this.state.offset[0],
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
            type: OperationType.ADD,
            value: this.state.offset[1],
            reason: this,
        });
    }
}

@TemplUtil.is('role-buff')
export class RoleBuffModel extends IRoleBuffModel {
    constructor(props: RoleBuffModel['props']) {
        super({
            uuid: props.uuid,
            state: { 
                isActive: true,
                offset: [0, 0],
                name: 'Unknown buff',
                desc: '+0/+0',
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
}