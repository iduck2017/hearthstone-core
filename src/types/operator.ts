import { Model } from "set-piece";

export type Operator = {
    maximum?: number;
    minumum?: number;
    type: OperatorType;
    offset: number;
    reason: Model;
}

export enum OperatorType {
    ADD = 1,
    SET,
}