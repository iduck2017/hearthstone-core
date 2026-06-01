import { useModel } from "set-piece";
import { FeatModel } from "../feats";

@useModel('divine-shield-model')
export class DivineShieldModel extends FeatModel {
    protected _brand: symbol = Symbol('divine-shield-model');
    public consume() { this.disable(); }
}
