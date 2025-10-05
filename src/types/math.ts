import { Model } from "set-piece";

export type Operation = {
    maxium?: number;
    minium?: number;
    type: OperationType;
    value: number;
    reason: Model;
}

export enum OperationType {
    PLUS = 1,
    MINUS = 2,
    SET,
}