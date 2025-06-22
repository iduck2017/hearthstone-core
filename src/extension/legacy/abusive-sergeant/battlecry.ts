import { MinionCardModel } from "@/common/card/minion";
import { FeatureModel } from "@/common/feature";
import { BattlecryModel } from "@/common/feature/battlecry";
import { MinionRoleModel } from "@/common/minion";
import { TargetType } from "@/types/query";
import { Selector } from "@/utils/selector";
import { AbusiveSergeantBuffModel } from "./buff";

export class AbusiveSergeantBattlecryModel extends BattlecryModel<
    MinionCardModel
> {
    constructor(props: AbusiveSergeantBattlecryModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Abusive Sergeant\'s Battlecry',
                desc: 'Give a minion +2 Attack this turn.',
                ...props.state,
            },
            child: {},
            refer: {}
        });
    }

    public prepare(): Selector | undefined {
        if (!this.route.game) return undefined;
        const candidates = this.route.game.query(TargetType.Minion, {})
        return new Selector(candidates, this.run).use()
    }

    public run(target: MinionRoleModel) {
        target.apply(new AbusiveSergeantBuffModel({}))
    }

}