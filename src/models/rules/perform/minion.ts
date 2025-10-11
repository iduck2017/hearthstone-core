import { Event } from "set-piece";
import { PerformModel } from ".";
import { SelectEvent, SelectUtil } from "../../../utils/select";
import { MinionBattlecryModel } from "../../..";
import { MinionHooksOptions } from "../../features/minion";
import { MinionCardModel } from "../../cards/minion";
import { AbortEvent } from "../../../types/abort-event";

export namespace MinionPerformModel {
    export type E = {};
    export type S = {};
    export type C = {};
    export type R = {};
}

export class MinionPerformModel extends PerformModel<
    [number, MinionHooksOptions],
    MinionPerformModel.E,
    MinionPerformModel.S,
    MinionPerformModel.C,
    MinionPerformModel.R
> {
    public get route() {
        const result = super.route;
        const minion: MinionCardModel | undefined = result.list.find(item => item instanceof MinionCardModel);
        return {
            ...result,
            minion,
        }
    }

    constructor(props?: MinionPerformModel['props']) {
        props = props ?? {}
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    public async run(from: number, to: number, options: MinionHooksOptions) {
        const event = new AbortEvent({})
        this.event.toRun(event);
        if (event.detail.isAbort) return;

        const player = this.route.player;
        if (!player) return;
        const minion = this.route.minion;
        if (!minion) return;
        // battlecry
        const feats = minion.child.feats;
        const battlecry = feats.child.battlecry;
        for (const item of battlecry) {
            const params = options.battlecry.get(item);
            if (!params) continue;
            await item.run(from, to, ...params);
        }
        // end
        const board = player.child.board;
        if (!board) return;
        const deploy = minion.child.deploy;
        deploy.run(board, to);
        this.event.onRun(new Event({}));
    }

    public async toRun(): Promise<[number, MinionHooksOptions] | undefined> {
        const minion = this.route.minion;
        if (!minion) return;
        const to = await this.select();
        if (to === undefined) return;
        // battlecry
        const feats = minion.child.feats;
        const battlecry = await MinionBattlecryModel.toRun(feats.child.battlecry);
        if (!battlecry) return;
        return [to, { battlecry }];
    }

    private async select(): Promise<number | undefined> {
        const player = this.route.player;
        if (!player) return;
        const board = player.child.board;
        const size = board.child.minions.length;
        const options = new Array(size + 1).fill(0).map((item, index) => index);
        const position = await SelectUtil.get(new SelectEvent(options, {
            code: (target) => `deploy-${target}`,
            desc: (target) => `Deploy to position ${target}`,
        }));
        return position;
    }
}