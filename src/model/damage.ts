import { Model, TranxUtil } from "set-piece";
import { RoleModel } from "./role";
import { CardModel } from "./card";
import { HeroModel } from "./hero";

export enum DamageType {
    ATTACK = 1,
    DEFEND = 2,
    SPELL = 3,
}

export type DamageCmd = {
    target: RoleModel;
    source: DamageModel;
    damage: number;
    result: number;
    type: DamageType;
}

export namespace DamageModel {
    export type State = {};
    export type Event = {
        toDealDamage: DamageCmd;
        onDealDamage: DamageCmd;
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
    constructor(props: DamageModel['props']) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public get route(): Model['route'] & Readonly<Partial<{
        card: CardModel;
        hero: HeroModel;
    }>> {
        const { parent, root } = super.route;
        const card = parent instanceof CardModel ? parent : undefined;
        const hero = parent instanceof HeroModel ? parent : undefined;
        return {
            card,
            hero,
            parent,
            root,
        }
    }

    private static toDealDamage(tasks: DamageCmd[]) {
        tasks = tasks.map(item => item.source.event.toDealDamage(item) ?? item);
        tasks = tasks.map(item => item.target.toRecvDamage(item) ?? item);
        return tasks;
    }

    public static dealDamage(tasks: DamageCmd[]) {
        tasks = DamageModel.toDealDamage(tasks);
        DamageModel._dealDamage(tasks);
    }

    @TranxUtil.span()
    private static _dealDamage(tasks: DamageCmd[]) {
        tasks.forEach(item => item.source.dealDamage(item));
    }

    private dealDamage(cmd: DamageCmd) {
        const res = cmd.target.recvDamage(cmd);
    }

    public onDealDamage(cmd: DamageCmd) {
        const health = cmd.target.state.health;
        // if (health < 0) this.runOverkill();
        // if (health === 0) this.runHornorableKill();
        this.event.onDealDamage(cmd);
    }
}