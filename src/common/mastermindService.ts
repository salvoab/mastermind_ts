export class mastermindService {

    secretCode:string;

    constructor(secretCode:string){
        this.secretCode = secretCode;
    }

    checkCode(userCode:string):string{
        const result = `posizione(${this.checkPositions(userCode)}) giusto(${this.checkCharacters(userCode)})`
        return result;
    }

    checkPositions(userCode:string):number {
        let positionCounter = 0;

        for (let i = 0; i < this.secretCode.length; i++) {
            const character = this.secretCode[i];
            if( character === userCode[i])
                positionCounter++;
        }

        return positionCounter;
    }

    checkCharacters(userCode:string):number {
        let characterCounter = 0;

        for (let i = 0; i < userCode.length; i++) {
            const userCharacter = userCode[i];

            if (this.secretCode.includes(userCharacter))
                characterCounter++;
        }

        return characterCounter;
    }

    checkWin(userCode:string):string {
        if(userCode === this.secretCode)
            return "WIN";
        return "";
    }
}