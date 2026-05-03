import { useAction, useChild, useModel, useRoute } from "set-piece";
import { WeaponModel } from "../../cards/weapon";
import { CardDeployerModel } from "./card-deployer";
import { DeployIntensionModel } from "../deploy-intension";
import { PlayerModel } from "../../entities/player";

@useModel('weapon-deployer')
export class WeaponDeployerModel extends CardDeployerModel {
    protected _brand: symbol = Symbol('weapon-deployer')

    @useRoute(() => WeaponModel)
    protected _weapon?: WeaponModel

    @useChild()
    private intensions?: DeployIntensionModel[];

    @useAction()
    private equip(player: PlayerModel) {
        const weapon = this._weapon;
        if (!weapon) return;
        player.workspace.removeCard(weapon);
        player.hero.equipWeapon(weapon);
    }

    private async prepareLaunch() {
        const card = this._card;
        if (!card) return;
        const intensions: DeployIntensionModel[] = [];
        for (const feat of card.battlecries) {
            const params = await feat.getTargets();
            const intension = new DeployIntensionModel({ feat, params });
            intensions.push(intension);
        }
        this.intensions = intensions;
        return true;
    }

    public async launch() {
        if (!this.isPlayable) return;
        const player = this._player;
        if (!player) return;
        const weapon = this._weapon;
        if (!weapon) return;
        const isValid = await this.prepareLaunch();
        if (!isValid) return;
        weapon.cost.consume();
        this.prepare(player);
        this.equip(player);
        while (this.intensions?.length) {
            const intension = this.intensions.pop();
            intension?.launch();
        }
        this.intensions = undefined;
        this.finishLaunch();
    }
}
