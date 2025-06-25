import { MinionCardModel } from "@/common/card/minion";
import { BattlecryModel } from "@/common/feature/battlecry";
import { TargetType } from "@/types/query";
import { Selector } from "@/utils/selector";
import { AbusiveSergeantEffectModel } from "./effect";
import { MinionRoleModel } from "@/common/role/minion";

export class AbusiveSergeantBattlecryModel extends BattlecryModel<
    [MinionRoleModel],
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

    public prepare(): [Selector<MinionRoleModel>] | undefined {
        if (!this.route.game) return;
        const candidates = this.route.game.query(TargetType.Minion, {})
        if (!candidates.length) return;
        return [new Selector(candidates, 'Choose a minion')];
    }

    public async run(target: MinionRoleModel) {
        target.apply(new AbusiveSergeantEffectModel({}))
    }

}