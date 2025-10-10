import { Event, Method, State, TranxUtil, Model } from "set-piece";
import { MinionHooksOptions, MinionFeatsModel } from "../features/minion";
import { RaceType } from "../../types/card";
import { RoleModel } from "../role";
import { MinionDisposeModel } from "../rules/dispose/minion";
import { MinionDeployModel } from "../rules/deploy/minion";
import { MinionPerformModel } from "../rules/perform/minion";
import { DeathrattleModel } from "../hooks/deathrattle";
import { FeatureModel } from "../rules/feature";
import { CardModel } from ".";

export namespace MinionCardModel {
    export type S = {
        readonly races: RaceType[];
    };
    export type E = {
        readonly onTrans: Event<{ target: MinionCardModel }>;
        readonly onSilence: Event;
    };
    export type C = {
        readonly feats: MinionFeatsModel;
        readonly role: RoleModel;
        readonly deploy: MinionDeployModel;
        readonly dispose: MinionDisposeModel
        readonly perform: MinionPerformModel;
    };
    export type P = {};
    export type R = {};
}

export abstract class MinionCardModel<
    E extends Partial<MinionCardModel.E & CardModel.E> & Model.E = {},
    S extends Partial<MinionCardModel.S & CardModel.S> & Model.S = {},
    C extends Partial<MinionCardModel.C & CardModel.C> & Model.C = {},
    R extends Partial<MinionCardModel.R & CardModel.R> & Model.R = {}
> extends CardModel<
    E & MinionCardModel.E, 
    S & MinionCardModel.S, 
    C & MinionCardModel.C,
    R & MinionCardModel.R
> {
    constructor(props: MinionCardModel['props'] & {
        uuid: string | undefined;
        state: S & State<Omit<CardModel.S, 'isActive'> & MinionCardModel.S>;
        child: C & Pick<MinionCardModel.C, 'role'> & Pick<CardModel.C, 'cost'>;
        refer: R;
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { 
                feats: props.child.feats ?? new MinionFeatsModel(),
                deploy: props.child.deploy ?? new MinionDeployModel(),
                dispose: props.child.dispose ?? new MinionDisposeModel(),
                perform: props.child.perform ?? new MinionPerformModel(),
                ...props.child 
            },
            refer: { ...props.refer },
        });
    }

    // transform
    public transform(target: MinionCardModel) {
        this.doTransform(target);
        this.event.onTrans(new Event({ target }));
    }

    @TranxUtil.span()
    private doTransform(target: MinionCardModel) {
        const board = this.route.board;
        const self: MinionCardModel = this;
        if (board) {
            const index = board.refer.queue?.indexOf(self);
            board.del(self);
            board.add(target, index);
        }
    }


    // silence
    public silence() {
        this.doSilence();
        this.event.onSilence(new Event({}));
    }

    @TranxUtil.span()
    private doSilence() {
        this.child.feats.child.list.forEach(item => item.deactive());
        this.child.feats.child.battlecry.forEach(item => item.deactive());
        this.child.feats.child.deathrattle.forEach(item => item.deactive());
        this.child.feats.child.startTurn.forEach(item => item.deactive());
        this.child.feats.child.endTurn.forEach(item => item.deactive());
        const role = this.child.role;
        role.child.feats.child.buffs.forEach(item => item.deactive());
        role.child.feats.child.items.forEach(item => item.deactive());
        role.child.feats.child.charge.deactive();
        role.child.feats.child.divineShield.deactive();
        role.child.feats.child.elusive.deactive();
        role.child.feats.child.frozen.deactive();
        role.child.feats.child.rush.deactive();
        role.child.feats.child.stealth.deactive();
        role.child.feats.child.taunt.deactive();
        role.child.feats.child.windfury.deactive();
    }
}