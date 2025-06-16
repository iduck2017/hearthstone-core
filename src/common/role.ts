import { DebugService, Model, Props, State, TranxService } from "set-piece";
import { MinionCardModel } from "./card/minion";
import { HeroModel } from "./hero";
import { BattlecryModel } from "./feature/battlecry";

export namespace RoleModel {
    export type Parent = MinionCardModel | HeroModel
    export type State = {
        readonly attack: number;
        readonly baseHealth: number;
        lostHealth: number;
    };
    export type Event = {
        toAttack: RoleModel;
        onAttack: RoleModel;
        onDamageDeal: {
            target: RoleModel;
            damage: number;
        };
        onDamageRecv: {
            target: RoleModel;
            damage: number;
        };
    };
    export type Child = {
    };
    export type Refer = {};
}

export class RoleModel<
    P extends Model = Model,
    E extends Partial<RoleModel.Event> & Model.Event = Partial<RoleModel.Event>,
    S extends Partial<RoleModel.State> & Model.State = Partial<RoleModel.State>,
    C extends Partial<RoleModel.Child> & Model.Child = Partial<RoleModel.Child>,
    R extends Partial<RoleModel.Refer> & Model.Refer = Partial<RoleModel.Refer>
> extends Model<
    P,
    RoleModel.Event & E,
    RoleModel.State & S,
    RoleModel.Child & C,
    RoleModel.Refer & R
> {
    public constructor(props: Props<
        RoleModel.State,
        RoleModel.Child,
        RoleModel.Refer
    > & {
        state: S & {
            readonly attack: number;
            readonly baseHealth: number;
        };
        child: C;
        refer: R;
    }) {
        super({
            uuid: props.uuid,
            state: {
                lostHealth: 0,
                ...props.state 
            },
            child: { ...props.child },
            refer: { ...props.refer },
        })
    }

    public get state(): State<RoleModel.State & S> & {
        readonly health: number;
    } {
        const result = super.state;
        return {
            ...result,
            lostHealth: this.draft.state.lostHealth,
            health: result.baseHealth - result.lostHealth,
        }
    }

    
    @DebugService.log()
    public attack(target: RoleModel) {
        this.event.toAttack(target);
        const { damageDeal, damageRecv } = this._attack(target);
        this.event.onDamageDeal({ target, damage: damageDeal })
        target.event.onDamageDeal({ target: this, damage: damageRecv })
        this.event.onDamageRecv({ target, damage: damageRecv })
        target.event.onDamageRecv({ target: this, damage: damageDeal })
        this.event.onAttack(target);
    }

    @TranxService.use()
    private _attack(target: RoleModel) {
        const damageDeal = this.state.attack;
        const damageRecv = target.state.attack;
        target.draft.state.lostHealth += damageDeal;
        this.draft.state.lostHealth += damageRecv;
        return {
            damageDeal,
            damageRecv,
        }
    }

}