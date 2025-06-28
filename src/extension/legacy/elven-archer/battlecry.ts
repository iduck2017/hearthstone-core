import { MinionCardModel } from "@/common/card/minion";
import { BattlecryModel } from "@/common/feature/battlecry";
import { RoleModel } from "@/common/role";
import { TargetType } from "@/types/query";
import { Selector } from "@/utils/selector";

export class ElvenArcherBattlecryModel extends BattlecryModel<
    [RoleModel],
    MinionCardModel
> {
    constructor(props: ElvenArcherBattlecryModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Elven Archer Battlecry',
                desc: 'Deal 1 damage.',
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public preparePlay(): [Selector<RoleModel>] | undefined {
        if (!this.route.game) return;
        const candidates = [
            ...this.route.game.query(TargetType.MinionRole, {}),
            ...this.route.game.query(TargetType.HeroRole, {}),
        ]
        if (candidates.length === 0) return;
        return [new Selector(candidates, 'Choose a target')]
    }

    public async run(target: RoleModel) {
        const role = this.route.parent?.child.role;
        if (!role) return;
        role.dealDamage(target, 1);
    }
}