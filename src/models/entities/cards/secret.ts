import { Event, Model, State, TranxService } from "set-piece"
import { CardModel } from "."
import { SecretDisposeModel } from "../../rules/dispose/secret"
import { SpellCardModel } from "./spell"
import { AbortEvent } from "../../../types/events/abort"

export namespace SecretCardModel {
    export type E = {
        readonly toDeploy: AbortEvent;
        readonly onDeploy: Event;
    }
    export type S = {}
    export type C = {
        readonly dispose: SecretDisposeModel;
    }
    export type R = {}
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
        state: S & State<CardModel.S & SpellCardModel.S>;
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

    public deploy() {
        // before
        const event = new AbortEvent({});
        this.event.toDeploy(event);
        let isValid = event.detail.isValid;
        if (!isValid) return;

        // execute
        isValid = this.doDeploy();
        if (!isValid) return;

        // after
        this.event.onDeploy(new Event({}));
    }


    @TranxService.span()
    private doDeploy(): boolean {
        const player = this.route.player;
        if (!player) return false;
        const board = player.child.board;
        if (!board) return false;
        board.add(this);
        return true;
    }

}