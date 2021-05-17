import {User} from './user';

const fs = require('fs');
const path = require('path');

export class UsersService{

    constructor(){ }

    public getUser(machineContext, nickname:string):User{
        const retrivedPlayer = machineContext['players'].find(player => player.nickname === nickname);
        if( retrivedPlayer ){
            console.log('recuperato', retrivedPlayer);
            
            return retrivedPlayer;
        }
        else {
            const newPlayer = new User(nickname);
            machineContext['players'].push(newPlayer);
            //console.log('nuovo utente inserito in', machineContext['players']);
            return newPlayer;
        }
    }

    public updateUser(machineContext){
        const actualPlayerPosition = machineContext['players'].findIndex(player => player === machineContext['actualPlayer']);
        machineContext['players'][actualPlayerPosition] = machineContext['actualPlayer'];
    }

    public deleteUser(machineContext, nickname:string):User{
        const playerPosition = machineContext['players'].findIndex(player => player.nickname === nickname);
        if (playerPosition > -1){
            const deletedPlayer = machineContext['players'][playerPosition];
            machineContext['players'].splice(playerPosition, 1);
            return deletedPlayer;
        }

        return null;
    }

    public loadMachine(machineContext, machineContextPath:string):boolean{
        if( fs.existsSync(machineContextPath) ){
            const oldContext = JSON.parse( fs.readFileSync(machineContextPath) );
            //console.log(oldContext.players);
            oldContext.players.forEach(player => {
                machineContext['players'].push(new User(player._nickname, player._points));
            });
            //console.log('loaded: ', machineContext['players']);
            return true;
        }

        return false;
    }

    public saveMachine(machineContext, machineContextPath:string){
        const directoryPath = path.dirname(machineContextPath);
        fs.promises.mkdir(directoryPath, { recursive: true }).catch(console.error);
        fs.writeFileSync(machineContextPath, JSON.stringify(machineContext));
    }

}