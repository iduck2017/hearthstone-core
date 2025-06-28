export type Optional<T extends Record<string, any>> = {
    [K in keyof T]: T[K] | undefined;
}