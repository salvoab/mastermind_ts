/*
Creare un programma che legga da linea di comando, e controlli se il codice immesso è uguale al codice segreto.
*/

import {mastermindService} from "./common/mastermindService"

import readline  from 'readline'
import { inputService } from "./common/inputService";

const CODICE_SEGRETO = "1234"

async function main(){
    const gameService = new mastermindService();
    const userInputService = new inputService();

    let validCode:string;

    
    validCode = await userInputService.recuperaCodiceValido();

    console.log( gameService.checkCode(validCode, CODICE_SEGRETO) );
    console.log( gameService.checkWin(validCode, CODICE_SEGRETO) );

    

    return "fine";
    

    /*
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

    return "fine";*/


}

main().then(message => console.log(message)).catch(error => console.log(error))