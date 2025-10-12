import { Event, Method, Model, TranxUtil } from "set-piece";
import { CardModel } from ".";
import { WeaponAttackModel } from "../rules/weapon/attack";
import { WeaponActionModel } from "../rules/weapon/action";
import { WeaponHooksOptions, WeaponFeaturesModel } from "../features/group/weapon";
import { WeaponDisposeModel } from "../rules/dispose/weapon";
import { AbortEvent } from "../../types/abort-event";
import { WeaponBattlecryModel } from "../features/hooks/weapon-battlecry";
import { BoardModel } from "../board";

export namespace WeaponCardModel {
    export type S = {};
    export type E = {

    };
    export type C = {
        readonly feats: WeaponFeaturesModel;
        readonly attack: WeaponAttackModel;
        readonly action: WeaponActionModel;
        readonly dispose: WeaponDisposeModel;
    };
    export type R = {};
}

@TranxUtil.span(true)
export abstract class WeaponCardModel<
    E extends Partial<WeaponCardModel.E & CardModel.E> & Model.E = {},
    S extends Partial<WeaponCardModel.S & CardModel.S> & Model.S = {},
    C extends Partial<WeaponCardModel.C & CardModel.C> & Model.C = {},
    R extends Partial<WeaponCardModel.R & CardModel.R> & Model.R = {}
> extends CardModel<
    [WeaponHooksOptions],
    E & WeaponCardModel.E,
    S & WeaponCardModel.S,
    C & WeaponCardModel.C,
    R & WeaponCardModel.R
> {
    constructor(props: WeaponCardModel['props'] & {
        state: S & WeaponCardModel.S & Omit<CardModel.S, 'isActive'>;
        child: C & Pick<WeaponCardModel.C, 'attack' | 'action'> & Pick<CardModel.C, 'cost'>;
        refer: R & WeaponCardModel.R;
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: {
                dispose: props.child.dispose ?? new WeaponDisposeModel(),
                feats: props.child.feats ?? new WeaponFeaturesModel(),
                ...props.child,
            },
            refer: { ...props.refer },
        })
    }

    
    public async use(from: number, options: WeaponHooksOptions) {
        const event = new AbortEvent({})
        this.event.toUse(event);
        if (event.detail.isAbort) return;

        const player = this.route.player;
        if (!player) return;

        // battlecry
        const feats = this.child.feats;
        const battlecry = feats.child.battlecry;
        for (const item of battlecry) {
            const params = options.battlecry.get(item);
            if (!params) continue;
            await item.run(from, ...params);
        }
        // end
        const board = player.child.board;
        if (!board) return;
        this.deploy(board);

        this.event.onUse(new Event({}));
    }

    protected async toUse(): Promise<[WeaponHooksOptions] | undefined> {
        // battlecry
        const feats = this.child.feats;
        const battlecry = await WeaponBattlecryModel.toRun(feats.child.battlecry);
        if (!battlecry) return;
        return [{ battlecry }];
    }


    
    // equip
    public deploy(board?: BoardModel) {
        const player = this.route.player;
        if (!board) board = player?.child.board;
        if (!board) return;
        this.doDeploy(board);
        this.event.onDeploy(new Event({}));
    }

    @TranxUtil.span()
    private doDeploy(board: BoardModel) {
        const player = this.route.player;
        const hand = player?.child.hand;
        if (hand) hand.drop(this);
        const prev = board.child.weapon;
        if (prev) {
            prev.child.dispose.active(true);
            board.del(prev);
        }
        board.add(this);
    }
}