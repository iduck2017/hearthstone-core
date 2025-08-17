import { DebugUtil, Model } from "set-piece";
import { DamageModel, DamageType } from "../damage";
import { RoleModel } from ".";
import { GameModel } from "../game";
import { PlayerModel } from "../player";
import { SelectUtil } from "../../utils/select";

export namespace AttackModel {
    export type Event = {
        toRun: { target: RoleModel, isAbort?: boolean };
        onRun: { target: RoleModel };
    }
    export type State = {
        origin: number;
        offset: number;
    }
    export type Child = {}
    export type Refer = {}
}

export class AttackModel extends Model<
    AttackModel.Event,
    AttackModel.State,
    AttackModel.Child,
    AttackModel.Refer
> {

    public get route() {
        const route = super.route;
        const role: RoleModel | undefined = route.path.find(item => item instanceof RoleModel);
        return { 
            ...route, 
            role,
            game: route.path.find(item => item instanceof GameModel),
            player: route.path.find(item => item instanceof PlayerModel),
        }
    }

    public get state() {
        const state = super.state;
        return {
            ...state,
            current: state.origin + state.offset,
        }
    }
    
    constructor(props: AttackModel['props'] & {
        state: Pick<AttackModel.State, 'origin'>
    }) {
        super({
            uuid: props.uuid,
            state: {
                offset: 0,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        })
    }

    @DebugUtil.log()
    public async attack() {
        const game = this.route.game;
        const roleA = this.route.role;
        const player = this.route.player;
        const turn = game?.child.turn;
        const action = roleA?.child.action;
        if (!turn) return;
        if (!game) return;
        if (!action) return;
        if (!player) return;
        if (turn.refer.current !== player) return;
        const opponent = player.refer.opponent;
        const targets = game.query({ side: opponent });
        const roleB = await SelectUtil.get({ targets })
        if (!roleB) return;
        const attackB = roleB.child.attack.state.current;
        const signal = this.event.toRun({ target: roleB })
        if (signal.isAbort) return;
        const healthB = roleB.child.health.state.current;
        if (healthB <= 0) return;
        const damageA = roleA.child.damage;
        const damageB = roleB.child.damage;
        if (!damageA) return;
        if (!damageB) return;
        if (!action.use()) return;
        DamageModel.deal([
            {
                target: roleB,
                source: damageA,
                damage: this.state.current,
                result: this.state.current,
                type: DamageType.ATTACK,
            },
            { 
                target: roleA, 
                source: damageB, 
                damage: attackB,
                result: attackB,
                type: DamageType.DEFEND,
            }
        ])
        this.event.onRun({ target: roleB }) 
    }
}
