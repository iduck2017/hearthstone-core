import { TranxUtil } from "set-piece";
import { AnchorEvent, AnchorModel } from "../model/anchor";
import { DeathUtil } from "./death";
import type { RoleModel } from "../model/role";

export enum DamageType {
    DEFAULT = 0,
    ATTACK = 1,
    DEFEND = 2,
    SPELL = 3,
}

export class DamageEvent extends AnchorEvent {
    public readonly type: DamageType;
    public readonly target: RoleModel;
    public readonly origin: number;
    public result: number;
    public isBlock?: boolean;

    constructor(props: {
        type: DamageType;
        source: AnchorModel<DamageEvent>;
        target: RoleModel;
        origin: number;
    }) {
        super(props)
        this.type = props.type;
        this.origin = props.origin;
        this.result = props.origin;
        this.target = props.target;
        this.isBlock = false;
    }
}

export namespace DamageModel {
    export type Event = {
        toRun: DamageEvent;
        onRun: DamageEvent;
    };
    export type State = {};
    export type Child = {};
    export type Refer = {};
}

export class DamageUtil {
    @DeathUtil.span()
    public static run(tasks: DamageEvent[]) {
        tasks = tasks.map(item => item.source.toRun(item) ?? item);
        tasks = tasks.map(item => item.target.child.health.toHurt(item) ?? item);
        tasks = DamageUtil.doRun(tasks);
        tasks.forEach(item => item.target.child.health.onHurt(item));
        tasks.forEach(item => {
            item.source.onRun(item);
            item.source.route.hero?.child.anchor.onRun(item);
            item.source.route.card?.child.anchor.onRun(item);
        });
    }

    @TranxUtil.span()
    private static doRun(tasks: DamageEvent[]) {
        return tasks.map(item => item.target.child.health.doHurt(item));
    }

    private constructor() {}
}