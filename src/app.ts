/*
Creare un programma che legga da linea di comando, e controlli se il codice immesso è uguale al codice segreto.
*/

import {mastermindService} from "./common/mastermindService"

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const CODICE_SEGRETO = "1234"

function checkCode(code:string):string{
    if(CODICE_SEGRETO === code )
        return "Complimenti hai indovinato il codice segreto";
    return "Codice errato";
}

function main():string{
    const service = new mastermindService();

    rl.question('Inserisci il codice segreto: ', (answer:string) => {
        
        console.log( service.checkCode(answer, CODICE_SEGRETO) );
        
        rl.close();
    });
    return "fine";
}

main()