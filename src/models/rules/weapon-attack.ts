import { Decor, Event, EventUtil, Frame, Method, Model, StateUtil } from "set-piece";
import { GameModel, PlayerModel, HeroModel, RoleAttackModel, TurnModel, BoardModel, WeaponCardModel, DamageEvent, RoleAttackDecor } from "../..";
import { OperatorType } from "../../types/operator";
import { WeaponAttackDecor } from "../../types/decors/weapon-attack";

export namespace WeaponAttackModel {
    export type E = {}
    export type S = {
        origin: number;
        current: number;
    }
    export type C = {}
    export type R = {}
}

export class WeaponAttackModel extends Model<
    WeaponAttackModel.E,
    WeaponAttackModel.S,
    WeaponAttackModel.C,
    WeaponAttackModel.R
> {
    public get chunk() {
        return {
            current: this.state.current,
            origin: this.state.origin,
        }
    }

    public get decor(): WeaponAttackDecor {
        return new WeaponAttackDecor(this);
    }

    public get route() {
        const result = super.route;
        return {
            ...result,
            weapon: result.items.find(item => item instanceof WeaponCardModel),
            player: result.items.find(item => item instanceof PlayerModel),
            game: result.items.find(item => item instanceof GameModel),
            board: result.items.find(item => item instanceof BoardModel),
            hero: result.items.find(item => item instanceof HeroModel),
        }
    }

    public get state() {
        const result = super.state;
        return {
            ...result,
            isReady: this.isReady,
        }
    }

    protected get isReady() {
        const player = this.route.player;
        if (!player) return false
        if (!player.state.isCurrent) return false;

        if (!this.route.hero) return false;
        return true;
    }

    constructor(props: WeaponAttackModel['props'] & {
        state: Pick<WeaponAttackModel.S, 'origin'>
    }) {
        const current = props.state.current ?? props.state.origin;
        super({
            uuid: props.uuid,
            state: { 
                current,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @EventUtil.on(self => self.handleChange)
    private listenChange() {
        const attack: WeaponAttackModel = this;
        return attack.proxy.event?.onChange;
    }
    public handleChange(that: WeaponAttackModel, event: Event<Frame<WeaponAttackModel>>) {
        if (event.detail.state.current !== that.state.current) {
            this.reload();
        }
    }

    @StateUtil.on(self => self.modifyAttack)
    private listenAttack() {
        return this.route.player?.proxy.child.hero.child.attack.decor;
    }
    private modifyAttack(that: RoleAttackModel, decor: RoleAttackDecor) {
        if (!this.isReady) return;
        decor.add({
            type: OperatorType.ADD,
            offset: this.state.current,
            reason: this,
        });
    }
}