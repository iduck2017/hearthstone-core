import { Model, useMountHook } from "set-piece";
import { AbstractConstructor } from "set-piece/dist/types";

export function useHealthBuff<
    M extends Model
>(value: number) {
    return function(BaseClass: AbstractConstructor<M>) {
       
    } 
}