import { BattlecryModel } from "@/common/feature/battlecry";
import { MinionRoleModel } from "@/common/role/minion";
import { TargetType } from "@/types/query";
import { Selector } from "@/utils/selector";
import { ShatteredSunClericEffectModel } from "./buff";
import { DebugService } from "set-piece";

export class ShatteredSunClericBattlecryModel extends BattlecryModel<
    [MinionRoleModel]
> {
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

    public prepare(): [Selector<MinionRoleModel>] | undefined {
        if (!this.route.game) return;
        const candidates = this.route.game.query(TargetType.Minion, { 
            side: this.route.owner 
        })
        if (candidates.length === 0) return;
        return [new Selector(candidates, 'Choose a friendly minion')]
    }

    @DebugService.log()
    public async run(target: MinionRoleModel) {
        target.apply(new ShatteredSunClericEffectModel({}))
    }
}