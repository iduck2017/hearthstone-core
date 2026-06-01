import { useModel } from "set-piece";
import { FeatModel } from "../../../feats";
import { WeaponAttackBuffModel } from "../../../feats/weapon-attack-buff";
import { WeaponDurabilityBuffModel } from "../../../feats/weapon-durability-buff";

@useModel('captain-greenskin-buff-model')
export class CaptainGreenskinBuffModel extends FeatModel {
    protected _brand: symbol = Symbol('captain-greenskin-buff-model');

    constructor() {
        super({
            subFeats: [
                new WeaponAttackBuffModel(1),
                new WeaponDurabilityBuffModel(1),
            ],
        });
    }
}
