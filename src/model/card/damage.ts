import { Model } from "set-piece";
import { RoleModel } from "../role";
import { CardModel } from ".";
import { HeroModel } from "../hero";

export enum DamageType {
    ATTACK = 1,
    DEFEND = 2,
    SPELL = 3,
}

export type DamageForm = {
    target: RoleModel;
    source: DamageModel;
    damage: number;
    result: number;
    type: DamageType;
}

export namespace DamageModel {
    export type State = {};
    export type Event = {
        toDeal: DamageForm;
        onDeal: DamageForm;
    };
    export type Child = {};
    export type Refer = {};
}

export class DamageModel extends Model<
    DamageModel.Event,
    DamageModel.State,
    DamageModel.Child,
    DamageModel.Refer
> {
    public get route() {
        const path = super.route.path;
        const card: CardModel | undefined = path.find(item => item instanceof CardModel);
        const hero: HeroModel | undefined = path.find(item => item instanceof HeroModel);
        return { ...super.route, card, hero }
    }

    constructor(props: DamageModel['props']) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }
    
    public static deal(tasks: DamageForm[]) {
        tasks = tasks.map(item => item.source.event.toDeal(item) ?? item);
        tasks = tasks.map(item => item.target.child.health.toHurt(item) ?? item);
        tasks = tasks.map(item => item.source.doDeal(item));
        tasks.forEach(item => item.target.child.health.onHurt(item));
        tasks.forEach(item => item.source.onDeal(item));
    }

    private doDeal(form: DamageForm) {
        const res = form.target.child.health.doHurt(form);
        return res;
    }

    public onDeal(form: DamageForm) {
        this.event.onDeal(form);
    }
}