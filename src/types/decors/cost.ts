import { Decor } from "set-piece";
import { Operator, OperatorType } from "../operator";
import { CostModel } from "../../models/rules/cost";

export class CostDecor extends Decor<CostModel.S> {

    private operations: Operator[] = [];
    public get result() {
        const result = { ...this._origin };
        const items = this.operations; // .filter(item => !(item.reason instanceof IRoleBuffModel));
        // plus first
        items.sort((a, b) => {
            if (a.offset > 0 && b.offset < 0) return -1;
            if (a.offset < 0 && b.offset > 0) return 1;
            return 0;
        })
        items.sort((a, b) => {
            if (a.offset < 0 || b.offset < 0) return 0;
            if (a.maximum === undefined) return 1;
            if (b.maximum === undefined) return -1;
            if (a.maximum < b.maximum) return -1;
            return 0;
        })
        items.sort((a, b) => {
            if (a.offset > 0 || b.offset > 0) return 0;
            if (b.minimum === undefined) return 1;
            if (a.minimum === undefined) return 1;
            if (a.minimum > b.minimum) return -1;
            return 0;
        })
        items.sort((a, b) => {
            if (a.type === OperatorType.SET) return -1;
            if (b.type === OperatorType.SET) return 1;
            return 0;
        })
        items.forEach(item => {
            if (item.type === OperatorType.ADD) {
                if (item.maximum !== undefined) {
                    if (result.current + item.offset > item.maximum) result.current = item.maximum;
                    else result.current += item.offset;
                } else if (item.minimum !== undefined) {
                    if (result.current + item.offset < item.minimum) result.current = item.minimum;
                    else result.current += item.offset;
                } else {
                    result.current += item.offset;
                }
            }
            if (item.type === OperatorType.SET) result.current = item.offset;
        })
        if (result.current <= 0) result.current = 0;
        return result;
    }
    
    public add(operation: Operator) { 
        this.operations.push(operation);
    }
}