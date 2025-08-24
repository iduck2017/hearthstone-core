import { DebugUtil, Model } from "set-piece";
import { DamageUtil, DamageType, DamageEvent, CardModel } from "../..";
import { RoleModel } from ".";
import { GameModel } from "../game";
import { PlayerModel } from "../player";
import { AbortEvent } from "../../utils/abort";

export class AttackEvent extends AbortEvent {
    public readonly target: RoleModel;

    constructor(props: { target: RoleModel }) {
        super();
        this.target = props.target;
    }
}

export namespace AttackModel {
    export type Event = {
        toRun: AttackEvent;
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
        const card: CardModel | undefined = route.path.find(item => item instanceof CardModel);
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

    public check(): boolean {
        if (!this.state.current) return false;
        return true;
    }

    @DebugUtil.log()
    public async run(roleB: RoleModel) {
        const roleA = this.route.role;
        if (!roleA) return;
        if (!this.check()) return;
        const attackB = roleB.child.attack.state.current;
        const event = this.event.toRun(new AttackEvent({ target: roleB }))
        if (event.isAbort) return;
        const healthB = roleB.child.health.state.current;
        if (healthB <= 0) return;
        const anchorA = roleA.child.anchor;
        const anchorB = roleB.child.anchor;
        if (!anchorA) return;
        if (!anchorB) return;
        DamageUtil.run([
            new DamageEvent({
                target: roleB,
                type: DamageType.ATTACK,
                source: anchorA,
                origin: this.state.current,
            }),
            new DamageEvent({
                target: roleA,
                type: DamageType.DEFEND,
                source: anchorB,
                origin: attackB,
            }),
        ])
        this.event.onRun({ target: roleB }); 
    }
}
