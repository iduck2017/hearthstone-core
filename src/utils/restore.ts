import { TranxUtil } from "set-piece";
import { DeathUtil } from "./death";
import { AnchorEvent, AnchorModel } from "../model/rules/anchor";
import { RoleModel } from "../model/role";

export class RestoreEvent extends AnchorEvent {
    public readonly origin: number;
    public readonly target: RoleModel;
    public result: number;

    constructor(props: {
        origin: number;
        source: AnchorModel<RestoreEvent>;
        target: RoleModel;
    }) {
        super(props)
        this.origin = props.origin;
        this.result = props.origin;
        this.target = props.target;
    }
}

export class RestoreUtil {
    @DeathUtil.span()
    public static run(tasks: RestoreEvent[]) {
        tasks = tasks.map(item => item.source.toRun(item) ?? item);
        tasks = tasks.map(item => item.target.child.health.toHeal(item) ?? item);
        tasks = RestoreUtil.doRun(tasks);
        tasks.forEach(item => item.target.child.health.onHeal(item));
        tasks.forEach(item => {
            item.source.onRun(item);
            item.source.route.player?.child.anchor.onRun(item);
            item.source.route.card?.child.anchor.onRun(item);
        });
    }

    @TranxUtil.span()
    private static doRun(tasks: RestoreEvent[]) {
        return tasks.map(item => item.target.child.health.doHeal(item));
    }

    private constructor() {}
}