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
    let keepPlaying = false;

    //do {
        rl.question('Inserisci il codice segreto: ', (code:string) => {
            
            console.log( service.checkCode(code, CODICE_SEGRETO) );
            rl.close();
            /*
            rl.question('Vuoi continuare: [S/N] ? ', (answer:string) => {
                
                if(answer.toUpperCase() === "S")
                    keepPlaying = true;
                else
                    keepPlaying = false;
                console.log(keepPlaying);
                
                rl.close();
            });*/
        });

        //console.log(keepPlaying);
        

    //} while (keepPlaying);

    return "fine";
}

main()