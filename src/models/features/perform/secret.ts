import { TranxUtil } from "set-piece";
import { SecretCardModel } from "../../entities/cards/secret";
import { SpellPerformModel } from "./spell";
import { AbortEvent } from "../../../types/events/abort";

export namespace SecretPerformModel {
    export type E = {
        toDeploy: AbortEvent;
        onDeploy: Event;
    }
    export type S = {}
    export type C = {}
    export type R = {}
}

export class SecretPerformModel extends SpellPerformModel {
    public get status(): boolean {
        if (!super.status) return false;
        const player = this.route.player;
        if (!player) return false;
        const board = player.child.board;
        if (!board) return false;
        if (board.child.secrets.length >= 5) return false;
        return true;
    }

    public get route() {
        const result = super.route;
        const secret: SecretCardModel | undefined = result.items.find(item => item instanceof SecretCardModel);
        return {
            ...result,
            secret,
        }
    }

    @TranxUtil.span()
    public deploy() {
        const player = this.route.player;
        if (!player) return;
        const secret = this.route.secret;
        if (!secret) return;

        // deploy from hand
        const hand = player.child.hand;
        if (hand) hand.del(secret);
        
        // deploy from template
        const app = this.route.app;
        if (app) app.unlink(secret);

        const board = player.child.board;
        if (!board) return;
        board.add(secret);
    }
}