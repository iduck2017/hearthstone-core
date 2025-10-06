import { Model } from "set-piece";

export type Operation = {
    maximum?: number;
    minumum?: number;
    type: OperationType;
    value: number;
    reason: Model;
}

export enum OperationType {
    ADD = 1,
    SET,
}