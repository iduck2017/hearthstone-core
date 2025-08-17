import { Model, Route, TranxUtil } from "set-piece";
import { RoleModel } from "./role";
import { CardModel } from "./card";
import { HeroModel } from "./heroes";
import { DeathUtil } from "../utils/death";

export enum DamageType {
    ATTACK = 1,
    DEFEND = 2,
    SPELL = 3,
    DEFAULT = 4,
}

export type DamageForm = {
    target: RoleModel;
    source: DamageModel;
    damage: number;
    result: number;
    type: DamageType;
}

export namespace DamageModel {
    export type Event = {
        toDeal: DamageForm;
        onDeal: DamageForm;
    };
    export type State = {};
    export type Child = {};
    export type Refer = {};
}

export class DamageModel extends Model<
    DamageModel.Event,
    DamageModel.State,
    DamageModel.Child,
    DamageModel.Refer
> {
    public get route(): Route & {
        card?: CardModel;
        hero?: HeroModel;
        role?: RoleModel;
    } {
        const path = super.route.path;
        const card = path.find(item => item instanceof CardModel);
        const hero = path.find(item => item instanceof HeroModel);
        const role = path.find(item => item instanceof RoleModel);
        return { ...super.route, card, hero, role }
    }

    constructor(props: DamageModel['props']) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
    
    @DeathUtil.span()
    public static deal(tasks: DamageForm[]) {
        tasks = tasks.map(item => item.source.event.toDeal(item) ?? item);
        tasks = tasks.map(item => item.target.child.health.toHurt(item) ?? item);
        tasks = DamageModel.doDeal(tasks);
        tasks.forEach(item => item.target.child.health.onHurt(item));
        tasks.forEach(item => {
            item.source.event.onDeal(item)
            item.source.route.hero?.child.damage.event.onDeal(item);
            item.source.route.card?.child.damage.event.onDeal(item);
            item.source.route.role?.child.damage.event.onDeal(item);
        });
    }

    @TranxUtil.span()
    private static doDeal(tasks: DamageForm[]) {
        return tasks.map(item => item.target.child.health.doHurt(item));
    }

}