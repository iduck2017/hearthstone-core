import { useModel } from "set-piece";
import { MinionModel } from "../../minion";
import { RoleAttackModel } from "../../../rules/role-attack";
import { RoleHealthModel } from "../../../rules/role-health";
import { ClassType } from "../../../utils/enums";
import { CostModel } from "../../../rules/cost";
import { RoleModel } from "../../../entities/role";
import { ChargeModel } from "../../../rules/charge";
import { LeeroyJenkinsBattlecryModel } from "./battlecry";
import { RarityType } from "../../../utils/enums";

@useModel('leeroy-jenkins-model')
export class LeeroyJenkinsModel extends MinionModel {
    protected _brand: symbol = Symbol('leeroy-jenkins-model');
    constructor() {
        super({
            class: ClassType.NEUTRAL,
            role: new RoleModel({
                attack: new RoleAttackModel({ origin: 6 }),
                health: new RoleHealthModel({ origin: 2 }),
                charge: new ChargeModel({ isActived: true }),
            }),
            cost: new CostModel({ origin: 5 }),
            rarity: RarityType.LEGENDARY,
            races: [],
            feats: [new LeeroyJenkinsBattlecryModel()],
        });
        
    }
}
