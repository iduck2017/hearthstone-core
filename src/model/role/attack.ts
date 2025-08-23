import { DebugUtil, Model } from "set-piece";
import { DamageUtil, DamageType, DamageEvent } from "../..";
import { RoleModel } from ".";
import { GameModel } from "../game";
import { PlayerModel } from "../player";
import { SelectUtil } from "../../utils/select";
import { MinionCardModel } from "../card/minion";
import { RushStatus } from "../entries/rush";
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

    private async select(): Promise<RoleModel | undefined> {
        const game = this.route.game;
        const role = this.route.role;
        const player = this.route.player;
        if (!role) return;
        const action = role.child.action;
        const entries = role.child.entries;
        const rush = entries.child.rush;
        if (!game) return;
        if (!action) return;
        if (!player) return;
        const opponent = player.refer.opponent;
        if (!opponent) return;
        const minions = opponent.refer.minions;
        const hero = opponent.refer.hero;
        let options: RoleModel[] = []
        if (rush.state.isActive == RushStatus.ACTIVE) options = minions;
        else options = [...minions, hero];
        const tauntOptions = options.filter(item => {
            const entries = item.child.entries;
            const taunt = entries.child.taunt;
            const stealth = entries.child.stealth;
            return taunt.state.isActive && !stealth.state.isActive;
        });
        if (tauntOptions.length) options = tauntOptions;
        options = options.filter(item => {
            const entries = item.child.entries;
            const stealth = entries.child.stealth;
            return !stealth.state.isActive;
        })
        const result = await SelectUtil.get({ options });
        return result;
    }

    @DebugUtil.log()
    public async run() {
        const game = this.route.game;
        const roleA = this.route.role;
        const player = this.route.player;
        const action = roleA?.child.action;
        if (!game) return;
        if (!action) return;
        if (!player) return;
        if (!action.check()) return;
        const roleB = await this.select();
        if (!roleB) return;
        const attackB = roleB.child.attack.state.current;
        const event = this.event.toRun(new AttackEvent({ target: roleB }))
        if (event.isAbort) return;
        const healthB = roleB.child.health.state.current;
        if (healthB <= 0) return;
        const anchorA = roleA.child.anchor;
        const anchorB = roleB.child.anchor;
        if (!anchorA) return;
        if (!anchorB) return;
        if (!action.consume()) return;
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
        this.event.onRun({ target: roleB }) 
    }
}
