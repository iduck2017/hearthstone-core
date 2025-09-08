import { Loader, Model } from "set-piece";
import { DisposeModel } from ".";
import { CardModel, CharacterModel } from "../../..";

export class CharacterDisposeModel extends DisposeModel {
    public get route() {
        const route = super.route;
        const character: CharacterModel | undefined = route.order.find(item => item instanceof CharacterModel)
        return {
            ...route,
            character,
        }
    }

    constructor(loader?: Loader<CharacterDisposeModel>) {
        super(() => {
            const props = loader?.() ?? {};
            return {
                uuid: props.uuid,
                state: { ...props.state },
                child: { ...props.child },
                refer: { ...props.refer },
            }
        });
    }

    protected check(): boolean {
        const character = this.route.character;
        if (!character) return true;
        const role = character.child.role;
        const health = role.child.health;
        if (health.state.current <= 0) return true;
        return false;
    }

    protected run(): void {
    }
}