import { Method } from "set-piece";

export class BatchUtil {
    private static thenners: Array<Method<void>> = [];
    private static callbacks: Array<Method<void>> = [];

    private static isLocked: boolean = false;
    
    public static span() {
        return function (
            target: any,
            propertyKey: string,
            descriptor: TypedPropertyDescriptor<Method>
        ): TypedPropertyDescriptor<Method> {
            const handler = descriptor.value;
            if (!handler) return descriptor;
            const instance = {
                [propertyKey](this: any, context: BatchUtil | undefined, ...args: any[]) {
                    BatchUtil.isLocked = true;
                    const result = handler.call(this, context, ...args);
                    let thenners: Method<void, []>[] = BatchUtil.thenners;
                    while (thenners.length > 0) {
                        thenners = BatchUtil.thenners;
                        BatchUtil.thenners = [];
                        thenners.forEach(item => item());
                    }
                    const callbacks: Method<void, []>[] = BatchUtil.callbacks;
                    BatchUtil.isLocked = false;
                    BatchUtil.callbacks = [];
                    callbacks.forEach(item => item());
                    return result;
                }
            }
            descriptor.value = instance[propertyKey];
            return descriptor;
        }
    }

    // public static skip() {
    //     return function (
    //         target: any,
    //         propertyKey: string,
    //         descriptor: TypedPropertyDescriptor<Method>
    //     ): TypedPropertyDescriptor<Method> {
    //         const handler = descriptor.value;
    //         if (!handler) return descriptor;
    //         const instance = {
    //             [propertyKey](this: any, context: BatchUtil | undefined, ...args: any[]) {
    //                 if (!BatchUtil.isLocked) return handler.call(this, context, ...args);
    //                 const thenners = BatchUtil.thenners;
    //                 const callbacks = BatchUtil.callbacks;
    //                 BatchUtil.callbacks = [];
    //                 BatchUtil.thenners = [];
    //                 BatchUtil.isLocked = false;
    //                 const result = handler.call(this, context, ...args);
    //                 thenners.forEach(thenner => thenner());
    //                 callbacks.forEach(callback => callback());
    //                 BatchUtil.isLocked = true;
    //                 return result;
    //             }
    //         }
    //         descriptor.value = instance[propertyKey];
    //         return descriptor;
    //     }
    // }


    public static then() {
        return function (
            target: any,
            propertyKey: string,
            descriptor: TypedPropertyDescriptor<Method<Method<void, []>>>
        ): TypedPropertyDescriptor<Method<Method<void, []>>> {
            const handler = descriptor.value;
            if (!handler) return descriptor;
            const instance = {
                [propertyKey](this: any, context: BatchUtil | undefined, ...args: any[]) {
                    if (!BatchUtil.isLocked) {
                        const thenner = handler.call(this, context, ...args);
                        thenner();
                        return thenner;
                    }
                    const thenners: Method<void, []>[] = BatchUtil.thenners;
                    const callbacks: Method<void, []>[] = BatchUtil.callbacks;
                    BatchUtil.thenners = [];
                    BatchUtil.callbacks = [];
                    BatchUtil.isLocked = false;
                    const thenner = handler.call(this, context, ...args);
                    BatchUtil.thenners = thenners;
                    BatchUtil.callbacks = callbacks;
                    BatchUtil.isLocked = true;
                    BatchUtil.thenners.push(thenner);
                    return thenner;
                }
            }
            descriptor.value = instance[propertyKey];
            return descriptor;
        }
    }

    public static end() {
        return function (
            target: any,
            propertyKey: string,
            descriptor: TypedPropertyDescriptor<Method<Method<void, []>>>
        ): TypedPropertyDescriptor<Method<Method<void, []>>> {
            const handler = descriptor.value;
            if (!handler) return descriptor;
            const instance = {
                [propertyKey](this: any, context: BatchUtil | undefined, ...args: any[]) {
                    if (!BatchUtil.isLocked) {
                        const callback = handler.call(this, context, ...args);
                        callback();
                        return callback;
                    }
                    const callbacks: Method<void, []>[] = BatchUtil.callbacks;
                    const thenners: Method<void, []>[] = BatchUtil.thenners;
                    BatchUtil.callbacks = [];
                    BatchUtil.thenners = [];
                    BatchUtil.isLocked = false;
                    const callback = handler.call(this, context, ...args);
                    BatchUtil.isLocked = true;
                    BatchUtil.thenners = thenners;
                    BatchUtil.callbacks = callbacks;
                    BatchUtil.callbacks.push(callback);
                    return callback;
                }
            }
            descriptor.value = instance[propertyKey];
            return descriptor;
        }
    }


    private constructor() {}
}