import { BattlecryModel, DamageEvent, DamageModel, DamageType, RoleModel, SelectEvent } from "../../src";
import { Loader, StoreUtil } from "set-piece";

@StoreUtil.is('elven-archer-battlecry')
export class ElvenArcherBattlecryModel extends BattlecryModel<[RoleModel]> {
    constructor(loader?: Loader<ElvenArcherBattlecryModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Elven Archer Battlecry',
                    desc: 'Deal 1 damage.',
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
            }
        });
    }

    public toRun(): [SelectEvent<RoleModel>] | undefined {
        const player = this.route.player;
        const game = this.route.game;
        if (!game) return;
        if (!player) return;
        const options = game.refer.roles;
        if (options.length === 0) return;
        return [new SelectEvent(options, { hint: 'Choose a target' })]
    }

    protected async doRun(target: RoleModel) {
        const card = this.route;
        if (!card) return;
        DamageModel.run([
            new DamageEvent({
                source: this.child.damage,
                target,
                origin: 1,
                type: DamageType.DEFAULT,
            })
        ])
    }
}