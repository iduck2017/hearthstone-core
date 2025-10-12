import { Event, Method, Model, State, TranxUtil } from "set-piece";
import { CardModel } from ".";
import { SecretDisposeModel } from "./dispose/secret";
import { SpellCardModel } from "./spell";
import { BoardModel } from "../board";

export namespace SecretCardModel {
    export type S = {};
    export type E = {};
    export type C = {
        readonly dispose: SecretDisposeModel;
    };
    export type R = {};
}

export abstract class SecretCardModel<
    E extends Partial<SecretCardModel.E & SpellCardModel.E & CardModel.E> & Model.E = {},
    S extends Partial<SecretCardModel.S & SpellCardModel.S & CardModel.S> & Model.S = {},
    C extends Partial<SecretCardModel.C & SpellCardModel.C & CardModel.C> & Model.C = {},
    R extends Partial<SecretCardModel.R & SpellCardModel.R & CardModel.R> & Model.R = {}
> extends SpellCardModel<
    E & SecretCardModel.E,
    S & SecretCardModel.S,
    C & SecretCardModel.C,
    R & SecretCardModel.R
> {
    constructor(props: SecretCardModel['props'] & {
        state: S & State<Omit<CardModel.S, 'isActive'> & SpellCardModel.S>;
        child: C & Pick<CardModel.C, 'cost'>;
        refer: R;
    }) {
        super({
            uuid: props.uuid,
            state: { ...props.state },
            child: { 
                dispose: props.child.dispose ?? new SecretDisposeModel(),
                ...props.child 
            },
            refer: { ...props.refer },
        });
    }

    
    // deploy
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
        board.add(this);
    }
}
