import { AppModel } from "./app";
import { GameModel } from "./entities/game";

const app = new AppModel();
const game = new GameModel();
app.setGame(game);