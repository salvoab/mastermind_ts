export class mastermindService {

    secretCode:string;

    constructor(secretCode:string){
        this.secretCode = secretCode;
    }

    checkCode(userCode:string):{position:number, matched:number} {        
        const positionCounter = [];
        const matchedPositions = [];
        const rowSecretCode = this.secretCode.split('');
        const rowUserCode = userCode.split('');
        console.log("Codice segreto" + this.secretCode);
        console.log("Codice utente" + userCode);


        
        for (let i = 0; i < this.secretCode.length; i++) {
            if(rowSecretCode[i] === rowUserCode[i]){
                rowSecretCode[i] = "T";
                rowUserCode[i] = "T";
            }
        }
        const remainingSecret = rowSecretCode.filter((element) => element !== "T");
        const remainingUserCode = rowUserCode.filter((element) => element !== "T");

        for (let i = 0; i<remainingSecret.length; i++){
            const index = remainingSecret.findIndex((element) => remainingUserCode[i] === element);
            if(index !== -1){
                remainingSecret[index] = "M";
            }
        }

        const position = this.secretCode.length - remainingSecret.length;
        const matched = position + remainingSecret.filter((element) => element === "M").length;
        
        return {position, matched};
    }

    checkWin(userCode:string):string {
        const {position, matched} = this.checkCode(userCode);
        if (5 === matched && 5 === position)
            return "WIN";
        return `posizione(${position}) giusto(${matched})`;
    }
}