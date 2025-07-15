import { CardModel } from "../model/card";
import { RoleModel } from "../model/role";


export type SelectReq<T = any> = {
    candidates: T[];
    hint?: string;
}
