export class mastermindService {

    checkCode(userCode:string, secretCode:string):string{
        /*if(secretCode === userCode )
            return "Complimenti hai indovinato il codice segreto";
        return "Codice errato";*/
        return this.checkPosition(userCode, secretCode) + " " + this.checkCharacters(userCode, secretCode);
    }

    checkPosition(userCode:string, secretCode:string):string {
        let positionCounter = 0;

        for (let i = 0; i < userCode.length; i++) {
            const userCharacter = userCode[i];

            for (let j = 0; j < secretCode.length; j++) {
                const secretCharacter = secretCode[j];
                if (userCharacter === secretCharacter && i === j)
                    positionCounter++;
            }
        }

        return `posizione(${positionCounter})`;
    }

    checkCharacters(userCode:string, secretCode:string):string {
        let characterCounter = 0;

        for (let i = 0; i < userCode.length; i++) {
            const userCharacter = userCode[i];

            for (let j = 0; j < secretCode.length; j++) {
                const secretCharacter = secretCode[j];
                if (userCharacter === secretCharacter)
                characterCounter++;
            }
        }

        return `giusto(${characterCounter})`;
    }

    checkWin(userCode:string, secretCode:string):string {
        if(userCode === secretCode)
            return "WIN";
        return "";
    }
}