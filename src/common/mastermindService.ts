export class mastermindService {
    checkCode(userCode:string, secretCode:string):string{
        if(secretCode === userCode )
            return "Complimenti hai indovinato il codice segreto";
        return "Codice errato";
    }
}