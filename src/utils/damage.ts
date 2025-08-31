// import { Model, TranxUtil } from "set-piece";
// import { DeathUtil } from "./death";
// import type { RoleModel } from "../models/role";
// import { AbortEvent } from "./event";



// export class DamageUtil {
//     @DeathUtil.span()
//     public static run(tasks: DamageEvent[]) {
//         tasks = tasks.map(item => item.source?.toRun(item) ?? item);
//         tasks = tasks.map(item => item.target.child.health.toHurt(item) ?? item);
//         // filter
//         tasks = tasks.filter(item => !item.isAbort);
//         // execute
//         tasks = DamageUtil.doRun(tasks);
//         // filter
//         tasks = tasks.filter(item => item.result > 0 && !item.isAbort);
//         tasks.forEach(item => item.target.child.health.onHurt(item));
//         tasks.forEach(item => {
//             item.source?.onRun(item);
//             const minion = item.source?.route.minion;
//             if (!minion) return;
//             const role = minion.child.role;
//             if (item.result > 0) role.child.entries.child.stealth.deactive();
//         });
//     }

//     @TranxUtil.span()
//     private static doRun(tasks: DamageEvent[]) {
//         return tasks.map(item => item.target.child.health.doHurt(item));
//     }

//     private constructor() {}
// }