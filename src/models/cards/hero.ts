// import { Model, StoreUtil } from "set-piece";
// import { SkillModel } from "../skills";

// export namespace HeroModel {
//     export type Event = {};
//     export type State = {
//         armor: number;
//     };
//     export type Child = {
//         skill: SkillModel
//     };
//     export type Refer = {}
// }

// @StoreUtil.is('hero')
// export class HeroModel<
//     E extends Partial<HeroModel.Event> & Model.Event = {},
//     S extends Partial<HeroModel.State> & Model.State = {},
//     C extends Partial<HeroModel.Child> & Model.Child = {},
//     R extends Partial<HeroModel.Refer> & Model.Refer = {}
// > extends Model<
//     E & HeroModel.Event,
//     S & HeroModel.State,
//     C & HeroModel.Child,
//     R & HeroModel.Refer
// > {
//     constructor(props: HeroModel['props'] & {
//         uuid: string | undefined;
//         state: S & Pick<HeroModel.State, 'armor'>,
//         child: C & Pick<HeroModel.Child, 'skill'>,
//         refer: R
//     }) {
//         super({
//             uuid: props.uuid,
//             state: { ...props.state },
//             child: { ...props.child },
//             refer: { ...props.refer },
//         });
//     }
// }