import User from './user';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

export class UsersService {
  public getUser(machineContext, nickname:string):User {
    const retrivedPlayer = machineContext.players.find((player) => player.nickname === nickname);
    if (retrivedPlayer) {
      // console.log('recuperato', retrivedPlayer);
      return retrivedPlayer;
    }

    const newPlayer = new User(nickname);
    machineContext.players.push(newPlayer);
    // console.log('nuovo utente inserito in', machineContext['players']);
    return newPlayer;
  }

  public updateUser(machineContext) {
    const actualPlayerPosition = machineContext.players.findIndex((player) => player === machineContext.actualPlayer);
    machineContext.players[actualPlayerPosition] = machineContext.actualPlayer;
  }

  public deleteUser(machineContext, nickname:string):User {
    const playerPosition = machineContext.players.findIndex((player) => player.nickname === nickname);
    if (playerPosition > -1) {
      const deletedPlayer = machineContext.players[playerPosition];
      machineContext.players.splice(playerPosition, 1);
      return deletedPlayer;
    }

    return null;
  }

  public loadMachine(machineContext, machineContextPath:string):boolean {
    if (fs.existsSync(machineContextPath)) {
      const oldContext = JSON.parse(fs.readFileSync(machineContextPath));
      // console.log(oldContext.players);
      oldContext.players.forEach((player) => {
        const newUser = new User(player._nickname, player._points);
        newUser.tries = player._tries;
        machineContext.players.push(newUser);
      });
      // console.log('loaded: ', machineContext['players']);
      return true;
    }

    return false;
  }

  public saveMachine(machineContext, machineContextPath:string) {
    const directoryPath = path.dirname(machineContextPath);
    fs.promises.mkdir(directoryPath, { recursive: true }).catch(console.error);
    fs.writeFileSync(machineContextPath, JSON.stringify(machineContext));
  }
}
