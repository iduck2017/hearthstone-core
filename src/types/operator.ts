import { Model } from "set-piece";

export type Operator = {
    maximum?: number;
    minimum?: number;
    type: OperatorType;
    offset: number;
    reason: Model;
}

export enum OperatorType {
    ADD = 1,
    SET,
}