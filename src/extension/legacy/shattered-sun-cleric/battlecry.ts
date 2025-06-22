import { BattlecryModel } from "@/common/feature/battlecry";
import { MinionRoleModel } from "@/common/minion";
import { TargetType } from "@/types/query";
import { Selector } from "@/utils/selector";
import { ShatteredSunClericBuffModel } from "./buff";

export class ShatteredSunClericBattlecryModel extends BattlecryModel {
    constructor(props: ShatteredSunClericBattlecryModel['props']) {
        super({
            uuid: props.uuid,
            state: {
                name: 'Shattered Sun Cleric\'s Battlecry',
                desc: 'Give a friendly minion +1/+1.',
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public prepare(): Selector | undefined {
        if (!this.route.game) return;
        const candidates = this.route.game.query(TargetType.Minion, {
            side: this.route.owner,
        })
        if (candidates.length === 0) return;
        return new Selector(candidates, this.run).use()
    }

    public run(target: MinionRoleModel) {
        target.apply(new ShatteredSunClericBuffModel({}))
    }
}