import { DebugUtil, Model } from "set-piece";
import { DamageModel, DamageType } from "../damage";
import { RoleModel } from ".";
import { GameModel } from "../game";
import { PlayerModel } from "../player";
import { SelectUtil } from "../../utils/select";
import { CardModel } from "../card";
import { MinionCardModel } from "../card/minion";
import { FilterType } from "../../types";
import { RushStatus } from "../features/rush";

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
        const card: MinionCardModel | undefined = route.path.find(item => item instanceof MinionCardModel);
        return { 
            ...route, 
            role,
            card,
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
    public async run() {
        const game = this.route.game;
        const roleA = this.route.role;
        const player = this.route.player;
        const action = roleA?.child.action;
        const rush = roleA?.child.rush;
        if (!game) return;
        if (!action) return;
        if (!player) return;
        const opponent = player.refer.opponent;
        const minions = game.query({ side: opponent, isMinion: FilterType.INCLUDE });
        const heros = game.query({ side: opponent, isHero: FilterType.INCLUDE });
        const isRush = rush?.state.isActive === RushStatus.ACTIVE;
        let options = isRush ? minions : [...minions, ...heros];
        const taunt = options.filter(item => item.child.taunt.state.isActive);
        options = taunt.length ? taunt : options;
        const roleB = await SelectUtil.get({ options })
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
        if (!action.consume()) return;
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
