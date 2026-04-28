import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleModel } from "../../../entities/role";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { CostModel } from "../../../rules/cost";
import { ClassType } from "../../../rules/class";
import { RarityType } from "../../../rules/rarity";
import { GadgetzanAuctioneerFeatModel } from "./feat";

@useModel('gadgetzan-auctioneer-model')
export class GadgetzanAuctioneerModel extends MinionModel {
    protected _brand: symbol = Symbol('gadgetzan-auctioneer-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 4 }),
                health: new RoleHealthModel({ origin: 4 }),
            }),
            cost: new CostModel({ origin: 6 }),
            rarity: RarityType.RARE,
            races: [],
            feats: [new GadgetzanAuctioneerFeatModel()],
        });
    }
}
