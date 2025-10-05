import { Props, Event, Method, State, TranxUtil } from "set-piece";
import { MinionHooksOptions, MinionHooksModel } from "../hooks/minion";
import { CardModel, CardProps } from ".";
import { RaceType } from "../../types/card";
import { RoleModel } from "../role";
import { MinionDisposeModel } from "../rules/dispose/minion";
import { MinionDeployModel } from "../rules/deploy/minion";
import { MinionPerformModel } from "../rules/perform/minion";
import { DeathrattleModel } from "../hooks/deathrattle";
import { FeatureModel } from "../features";

export namespace MinionCardProps {
    export type S = {
        readonly races: RaceType[];
    };
    export type E = {
        readonly onTrans: Event<{ target: MinionCardModel }>;
        readonly onSilence: Event;
    };
    export type C = {
        readonly hooks: MinionHooksModel;
        readonly role: RoleModel;
        readonly deploy: MinionDeployModel;
        readonly dispose: MinionDisposeModel
        readonly perform: MinionPerformModel;
    };
    export type P = {};
    export type R = {};
}

export abstract class MinionCardModel<
    E extends Partial<MinionCardProps.E & CardProps.E> & Props.E = {},
    S extends Partial<MinionCardProps.S & CardProps.S> & Props.S = {},
    C extends Partial<MinionCardProps.C & CardProps.C> & Props.C = {},
    R extends Partial<MinionCardProps.R & CardProps.R> & Props.R = {}
> extends CardModel<
    E & MinionCardProps.E, 
    S & MinionCardProps.S, 
    C & MinionCardProps.C,
    R & MinionCardProps.R
> {
    constructor(loader: Method<MinionCardModel['props'] & {
        uuid: string | undefined;
        state: S & State<Omit<CardProps.S, 'isActive'> & MinionCardProps.S>;
        child: C & Pick<MinionCardProps.C, 'role'> & Pick<CardProps.C, 'cost'>;
        refer: R;
    }, []>) {
        super(() => {
            const props = loader();
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: { 
                    hooks: props.child.hooks ?? new MinionHooksModel(),
                    deploy: props.child.deploy ?? new MinionDeployModel(),
                    dispose: props.child.dispose ?? new MinionDisposeModel(),
                    perform: props.child.perform ?? new MinionPerformModel(),
                    ...props.child 
                },
                refer: { ...props.refer },
            }
        });
    }

    public add(feature: FeatureModel) {
        if (feature instanceof DeathrattleModel) this.child.hooks.add(feature);
        else this.draft.child.feats.push(feature);
    }


    // transform
    public transform(target: MinionCardModel) {
        this.doTransform(target);
        this.event.onTrans(new Event({ target }));
    }

    @TranxUtil.span()
    private doTransform(target: MinionCardModel) {
        const board = this.route.board;
        if (board) {
            const index = board.refer.order.indexOf(this);
            board.del(this);
            board.add(target);
            board.sort(target, index)
        }
    }


    // silence
    public silence() {
        this.doSilence();
        this.event.onSilence(new Event({}));
    }

    @TranxUtil.span()
    private doSilence() {
        this.child.feats.forEach(item => item.deactive());
        this.child.hooks.child.battlecry.forEach(item => item.deactive());
        this.child.hooks.child.deathrattle.forEach(item => item.deactive());
        this.child.hooks.child.startTurn.forEach(item => item.deactive());
        this.child.hooks.child.endTurn.forEach(item => item.deactive());
        const role = this.child.role;
        role.child.feats.forEach(item => item.deactive());
        role.child.buffs.forEach(item => item.deactive());
        role.child.entries.child.charge.deactive();
        role.child.entries.child.divineShield.deactive();
        role.child.entries.child.elusive.deactive();
        role.child.entries.child.frozen.deactive();
        role.child.entries.child.rush.deactive();
        role.child.entries.child.stealth.deactive();
        role.child.entries.child.taunt.deactive();
        role.child.entries.child.windfury.deactive();
    }
}