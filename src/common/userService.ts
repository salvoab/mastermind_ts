import {User} from './user';

export class UserService{

    constructor(private _users:Array<User>){
        this._users = _users;
    }

    /**
     * Search the nickname of a user player and give the user player instance if it was found
     * 
     * @param nickname The nickname of the player to find
     * @returns The player instance if the user was found, undefined otherwise
     */
    public getUser(nickname:string):User{
        return this._users.find((player, index) => player.nickname === nickname);
    }

    /**
     * Create and insert the player with a given nickname in the array of players.
     * If the nickname already exists then it make no changes in the players array.
     * 
     * @param nickname the player's nickname
     * @returns the array of players
     */
    public updateUser(nickname:string):Array<User>{
        const player = this.getUser(nickname);
        if (player){
            return this._users;
        }

        this._users.push( new User(nickname) );
        return this._users;
    }

    /**
     * Delete a player from the array of player, if the player's nickname exists.
     * 
     * @param nickname (string) the nickname of the player to delete
     */
    public deleteUser(nickname:string):void{
        const player = this.getUser(nickname);
        if(player){
            const deleteIndex = this._users.indexOf(player);
            if( deleteIndex > -1 ){
                this._users.splice(deleteIndex, 1);
            }
        }
    }

    public get users(){
        return this._users;
    }

    public set users(users:Array<User>){
        this._users = users;
    }
}