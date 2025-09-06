import { BattlecryModel, RestoreEvent, RestoreModel, RoleModel, SelectEvent } from "hearthstone-core";
import { Loader, StoreUtil } from "set-piece";

@StoreUtil.is('voodoo-doctor-battlecry')
export class VoodooDoctorBattlecryModel extends BattlecryModel<[RoleModel]> {
    constructor(loader?: Loader<VoodooDoctorBattlecryModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: {
                    name: 'Voodoo Doctor\'s Battlecry',
                    desc: 'Restore 2 Health.',
                    ...props.state,
                },
                child: { ...props.child },
                refer: { ...props.refer },
            }
        });
    }

    public toRun(): [SelectEvent<RoleModel>] | undefined {
        const game = this.route.game;
        if (!game) return;
        const minion = this.route.minion;
        if (!minion) return;
        const role = minion.child.role;

        const options = game.refer.roles.filter(item => item !== role);
        if (!options.length) return;
        return [new SelectEvent(options, { hint: 'Choose a target' })];
    }

    public async doRun(target: RoleModel) {
        RestoreModel.run([
            new RestoreEvent({
                source: this.child.restore,
                target: target,
                origin: 2,
            })
        ]);
    }
}