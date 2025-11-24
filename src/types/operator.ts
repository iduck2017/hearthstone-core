import { Model } from "set-piece";

export type Operator = {
    maximum?: number;
    minimum?: number;
    type: OperatorType;
    offset: number;
    method: Model;
}

export enum OperatorType {
    ADD = 1,
    SET,
}