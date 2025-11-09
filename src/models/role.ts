// import { Method, Model, TranxUtil } from "set-piece";
// import { GameModel } from "./game";
// import { PlayerModel } from "./player";
// import { RoleActionModel } from "./rules/role/action";
// import { RoleAttackModel } from "./rules/role/attack";
// import { RoleHealthModel } from "./rules/role/health";
// import { SleepModel } from "./rules/role/sleep";
// import { DeckModel, GraveyardModel, BoardModel, HandModel, MinionCardModel, RoleFeaturesModel } from "..";
// import { CardModel } from "./cards";
// import { HeroModel } from "./heroes";

// export namespace RoleModel {
//     export type S = {};
//     export type E = {};
//     export type C = {
//         readonly sleep: SleepModel;
//         readonly health: RoleHealthModel;
//         readonly attack: RoleAttackModel;
//         readonly action: RoleActionModel;
//         readonly feats: RoleFeaturesModel;
//     };
//     export type R = {};
// }

// export class RoleModel extends Model<
//     RoleModel.E,
//     RoleModel.S,
//     RoleModel.C,
//     RoleModel.R
// > {
//     public get chunk() {
//         const board = this.route.board
//         return {
//             uuid: this.uuid,
//             attack: this.child.attack.chunk,
//             health: this.child.health.chunk,
//             action: this.child.action.chunk,
//             sleep: (this.child.sleep.state.isActive && Boolean(board)) || undefined,
//             ...this.child.feats.chunk,
//         }
//     }

//     public get route() {
//         const result = super.route;
//         const card: CardModel | undefined = result.items.find(item => item instanceof CardModel);
//         const minion: MinionCardModel | undefined = result.items.find(item => item instanceof MinionCardModel);
//         return {
//             ...result,
//             game: result.items.find(item => item instanceof GameModel),
//             player: result.items.find(item => item instanceof PlayerModel),
//             hero: result.items.find(item => item instanceof HeroModel),
//             card,
//             minion,
//             board: result.items.find(item => item instanceof BoardModel),
//             deck: result.items.find(item => item instanceof DeckModel),
//             graveyard: result.items.find(item => item instanceof GraveyardModel),
//             hand: result.items.find(item => item instanceof HandModel),
//         }
//     }

//     public get name(): string {
//         return String(this.route.card?.name ?? this.route.player?.name);
//     }

//     public constructor(props: RoleModel['props'] & {
//         child: Pick<RoleModel.C, 'health' | 'attack'>;
//     }) {
//         super({
//             uuid: props.uuid,
//             state: { ...props.state },
//             child: { 
//                 sleep: props.child.sleep ?? new SleepModel(),
//                 action: props.child.action ?? new RoleActionModel(),
//                 feats: props.child.feats ?? new RoleFeaturesModel(),
//                 ...props.child,
//             },
//             refer: { ...props.refer }
//         })
//     }
// }