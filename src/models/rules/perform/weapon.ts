import { Event } from "set-piece";
import { PerformModel } from ".";
import { WeaponHooksOptions } from "../../features/weapon";
import { WeaponBattlecryModel } from "../../..";
import { WeaponCardModel } from "../../..";
import { AbortEvent } from "../../../types/event";

export namespace WeaponPerformModel {
    export type E = {};
    export type S = {};
    export type C = {};
    export type R = {};
}

export class WeaponPerformModel extends PerformModel<
    [WeaponHooksOptions],
    WeaponPerformModel.E,
    WeaponPerformModel.S,
    WeaponPerformModel.C,
    WeaponPerformModel.R
> {
    public get route() {
        const result = super.route;
        const weapon: WeaponCardModel | undefined = result.list.find(item => item instanceof WeaponCardModel);
        return {
            ...result,
            weapon,
        }
    }

    constructor(props?: WeaponPerformModel['props']) {
        props = props ?? {}
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public async run(from: number, options: WeaponHooksOptions) {
        const event = new AbortEvent({})
        this.event.toRun(event);
        if (event.detail.isAbort) return;

        const player = this.route.player;
        if (!player) return;
        const weapon = this.route.weapon;
        if (!weapon) return;
        // battlecry
        const feats = weapon.child.feats;
        const battlecry = feats.child.battlecry;
        for (const item of battlecry) {
            const params = options.battlecry.get(item);
            if (!params) continue;
            await item.run(from, ...params);
        }
        // end
        const board = player.child.board;
        if (!board) return;
        const deploy = weapon.child.deploy;
        deploy.run(board);
        this.event.onRun(new Event({}));
    }

    public async toRun(): Promise<[WeaponHooksOptions] | undefined> {
        const weapon = this.route.weapon;
        if (!weapon) return;
        // battlecry
        const feats = weapon.child.feats;
        const battlecry = await WeaponBattlecryModel.toRun(feats.child.battlecry);
        if (!battlecry) return;
        return [{ battlecry }];
    }

}