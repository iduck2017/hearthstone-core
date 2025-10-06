import { Model } from "set-piece";

export type Operation = {
    maximum?: number;
    minium?: number;
    type: OperationType;
    value: number;
    reason: Model;
}

export enum OperationType {
    ADD = 1,
    SET,
}