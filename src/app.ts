/*
Creare un programma che legga da linea di comando, e controlli se il codice immesso è uguale al codice segreto.
*/

import {mastermindService} from "./common/mastermindService"

import readline  from 'readline'
import { inputService } from "./common/inputService";

const CODICE_SEGRETO = "1234"

async function main(){
    const gameService = new mastermindService(CODICE_SEGRETO);
    const userInputService = new inputService();

    let validCode:string;
    let keepPlaying = false;

    do {
      validCode = await userInputService.recuperaCodiceValido();
  
      //console.log( gameService.checkCode(validCode) );
      const posizioniCorrette = gameService.checkPositions(validCode);
      const numeroCaratteriCorretti = gameService.checkCharacters(validCode);
      const risultato = `posizione(${posizioniCorrette}) giusto(${numeroCaratteriCorretti})`
      console.log( risultato );
      console.log( gameService.checkWin(validCode) );
      // altro possibile modo di verifica vittoria: if(4 === numeroCaratteriCorretti && 4 === posizioniCorrette)
  
      keepPlaying = await userInputService.chiediDiContinuare();
  
    } while(keepPlaying);

    userInputService.chiudiReadline();
    
    return "fine";

}

main().then(message => console.log(message)).catch(error => console.log(error))