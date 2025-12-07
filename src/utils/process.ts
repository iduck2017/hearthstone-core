// import { Method } from "set-piece";

// export class ProcessUtil {
//     private static callbacks: Map<ProcessUtil, Array<Method<void>>> = new Map();
    
//     public static yield() {
//         return function (
//             target: any,
//             propertyKey: string,
//             descriptor: TypedPropertyDescriptor<Method<void, [ProcessUtil | undefined, ...any[]]>>
//         ): TypedPropertyDescriptor<Method<void, [ProcessUtil | undefined, ...any[]]>> {
//             const handler = descriptor.value;
//             if (!handler) return descriptor;
//             const instance = {
//                 [propertyKey](this: any, context: ProcessUtil | undefined, ...args: any[]) {
//                     if (!context) return handler.call(this, context, ...args);
//                     const callbacks = ProcessUtil.callbacks.get(context) ?? [];
//                     callbacks.push(() => handler.call(this, context, ...args));
//                     ProcessUtil.callbacks.set(context, callbacks);
//                     return;
//                 }
//             }
//             descriptor.value = instance[propertyKey];
//             return descriptor;
//         }
//     }

//     public static span() {
//         return function (
//             target: any,
//             propertyKey: string, 
//             descriptor: TypedPropertyDescriptor<Method<any, [ProcessUtil | undefined, ...any[]]>>
//         ): TypedPropertyDescriptor<Method<any, [ProcessUtil | undefined, ...any[]]>> {
//             const handler = descriptor.value;
//             if (!handler) return descriptor;
//             const instance = {
//                 [propertyKey](this: any, context: ProcessUtil | undefined, ...args: any[]) {
//                     if (!context) context = new ProcessUtil();
//                     ProcessUtil.callbacks.set(context, []);
//                     const rersult = handler.call(this, context, ...args);
//                     if (rersult instanceof Promise) {
//                         rersult.then(() => {
//                             const callbacks = ProcessUtil.callbacks.get(context) ?? [];
//                             callbacks.forEach(callback => callback());
//                             ProcessUtil.callbacks.delete(context);
//                         })
//                     } else {
//                         const callbacks = ProcessUtil.callbacks.get(context) ?? [];
//                         callbacks.forEach(callback => callback());
//                         ProcessUtil.callbacks.delete(context);
//                     }
//                     return rersult;
//                 }
//             }
//             descriptor.value = instance[propertyKey];
//             return descriptor;
//         };
//     }


//     private constructor() {}
// }