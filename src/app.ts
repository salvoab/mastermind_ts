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

    const insertCode = () => {
        return new Promise((resolve, reject) => {
          rl.question('Inserisci il codice segreto: ', (code) => {
            console.log( service.checkCode(code, CODICE_SEGRETO) );
            console.log(service.checkWin(code, CODICE_SEGRETO));
            resolve(true);
          })
        })
    }

    const replay = () => {
        return new Promise((resolve, reject) => {
          rl.question('Vuoi continuare? [S/N]: ', (answer) => {
            if(answer.toUpperCase() === "S")
                    keepPlaying = true;
                else
                    keepPlaying = false;
            resolve(true);
          })
        })
    }

    const play = async () => {
        do{
            await insertCode();
            await replay();
        } while (keepPlaying)
        rl.close();
    }

    play()

    return "fine";
}

main()