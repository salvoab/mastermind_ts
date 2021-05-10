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
    let keepPlaying = false;

    do {
      validCode = await userInputService.recuperaCodiceValido();
  
      console.log( gameService.checkCode(validCode, CODICE_SEGRETO) );
      console.log( gameService.checkWin(validCode, CODICE_SEGRETO) );
  
      keepPlaying = await userInputService.chiediDiContinuare();
  
    } while(keepPlaying);

    userInputService.chiudiReadline();
    
    return "fine";

}

main().then(message => console.log(message)).catch(error => console.log(error))