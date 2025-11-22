import { RoleAttackModel } from "../rules/role-attack";
import { RoleAttackDecor } from "../../types/decors/role-attack";
import { RoleHealthModel } from "../rules/role-health";
import { RoleHealthDecor } from "../../types/decors/role-health";
import { OperatorType } from "../../types/operator";
import { Model, StateUtil, TemplUtil } from "set-piece";
import { RoleFeatureModel } from "../features/role";
import { FeatureModel } from "../features";
import { HeroModel } from "../..";
import { MinionCardModel } from "../entities/cards/minion";

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
> extends RoleFeatureModel<
    E & IRoleBuffModel.E,
    S & IRoleBuffModel.S,
    C & IRoleBuffModel.C,
    R & IRoleBuffModel.R
> {
    public get chunk() {
        const healthOffset = this.state.offset[1] >= 0 ? `+${this.state.offset[1]}` : this.state.offset[1];
        const attackOffset = this.state.offset[0] >= 0 ? `+${this.state.offset[0]}` : this.state.offset[0];
        const result = super.chunk;
        if (!result) return undefined;
        return { 
            ...result,
            desc: `Give this role ${attackOffset}/${healthOffset}`,
        }
    }

    public get route() {
        const result = super.route;
        const hero: HeroModel | undefined = result.items.find(item => item instanceof HeroModel);
        const minion: MinionCardModel | undefined = result.items.find(item => item instanceof MinionCardModel);
        return {
            ...result,
            role: hero ?? minion,
            hero,
            minion,
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
                isEnabled: true,
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
        if (!this.state.isEnabled) return;
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
        if (!this.state.isEnabled) return;
        decor.add({
            type: OperatorType.ADD,
            offset: this.state.offset[1],
            reason: this,
        });
    }

}
