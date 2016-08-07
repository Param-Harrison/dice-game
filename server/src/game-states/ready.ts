import { GAME_STATE_WAITING, GAME_STATE_IN_PROGRESS, CMD_ROLL_DICE } from '../constants';
import { randomInRange } from '../util';
import GameRoom from '../game-room';
import Player from '../player';
import GameState from '../game-state';


/**
 * First player to roll the dice triggers a new round
 */
export default class ReadyState extends GameState {

    playerLeft(player: Player) {
        const gameRoom = this.gameRoom;

        const newGameData = Object.assign({}, gameRoom.gameData);
        delete newGameData.score[player.id];

        gameRoom.setGameData(newGameData);
        
        if (this.gameRoom.playerCount < 2) {
            this.gameRoom.setState(GAME_STATE_WAITING);
        }
    }

    processMessage(message: any, sender: Player) {
        if (message.type === CMD_ROLL_DICE) {
            const gameData = this.gameRoom.gameData;
            const newGameData = Object.assign({}, gameData);
            
            newGameData.round++;
            newGameData.score = {
                [sender.id]: Array(gameData.numberOfDice).fill(1).map(() => randomInRange(1, 6))
            };

            this.gameRoom.setGameData(newGameData);
            this.gameRoom.setState(GAME_STATE_IN_PROGRESS);
        }
    }

}
