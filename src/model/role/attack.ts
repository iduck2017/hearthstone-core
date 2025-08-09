import { DebugUtil, LogLevel, Model, Route } from "set-piece";
import { RoleModel } from ".";
import { SelectUtil } from "../../utils/select";
import { GameModel } from "../game";
import { PlayerModel } from "../player";
import { DamageForm, DamageModel, DamageType } from "../card/damage";
import { CardModel } from "../card";
import { HeroModel } from "../hero";

export namespace AttackModel {
    export type Event = {
        toRun: { target: RoleModel, isAbort: boolean };
        onRun: { target: RoleModel, }
    };
    export type State = {
        buff: number;
        origin: number;
    };
    export type Child = {};
    export type Refer = {};
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
        const card: CardModel | undefined = route.path.find(item => item instanceof CardModel);
        const hero: HeroModel | undefined = route.path.find(item => item instanceof HeroModel);
        return { 
            ...super.route, 
            role, 
            card, 
            hero,
            game: route.path.find(item => item instanceof GameModel),
            player: route.path.find(item => item instanceof PlayerModel),
        };
    }
    
    public get state() {
        const state = super.state;
        return { 
            ...state, 
            current: state.origin + state.buff,
        }
    }

    public get refer() {
        const card = this.route.card;
        const hero = this.route.hero;
        const damage = card?.child.damage ?? hero?.child.damage;
        return { ...super.refer, damage }
    }

    constructor(props: AttackModel['props'] & {
        state: Pick<AttackModel.State, 'origin'>;
    }) {
        super({
            uuid: props.uuid,
            state: {
                buff: 0,
                ...props.state,
            },
            child: { ...props.child },
            refer: { ...props.refer },
        });
    }

    @DebugUtil.log()
    public async run() {
        const game = this.route.game;
        const role = this.route.role;
        if (!game || !role) return;
        const player = this.route.player;
        const opponent = player?.refer.opponent;
        const list = game.query({ side: opponent });
        if (!list.length) return;
        const target = await SelectUtil.get({ list })
        if (!target) return;
        const signal = this.event.toRun({ target, isAbort: false })
        if (signal.isAbort) return;
        if (!this.refer.damage) return;
        if (!target.refer.damage) return;
        const action = role.child.action.use();
        if (!action) return;
        DamageModel.deal([
            {
                target,
                source: this.refer.damage,
                damage: this.state.current,
                result: this.state.current,
                type: DamageType.ATTACK,
            },
            { 
                target: role, 
                source: target.refer.damage, 
                damage: target.child.attack.state.current,
                result: target.child.attack.state.current,
                type: DamageType.DEFEND,
            }
        ])
        this.event.onRun({ target }) 
    }
}