import { Model } from "set-piece";
import { EffectModel } from "./effect";

export namespace ChooseOneModel {
    export type E = {};
    export type S = {};
    export type C = {
        effect: EffectModel
    };
    export type R = {};
}


export class ChooseOneModel extends Model {
    
}