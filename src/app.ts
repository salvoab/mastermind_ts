/*
Creare un programma che legga da linea di comando, e controlli se il codice immesso è uguale al codice segreto.
*/

//import di librerie
import {interpret} from 'xstate';


//si lascia uno spazio e si importano le classi necessarie
import {MastermindMachine} from "./lib/machine";
import {mastermindService} from "./common/mastermindService";
import { inputService } from "./common/inputService";

//si lascia uno spazio e si dichiarano le costanti

const CODICE_SEGRETO = "12343"

/*async function main(){
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
*/
async function main() {
  const myMachine = new MastermindMachine();
  myMachine.interpret.start();
  myMachine.interpret.send({type: 'OK'});
  myMachine.interpret.send({type: 'OK'});
  


  return "fine";
}

main().then(message => console.log(message)).catch(error => console.log(error))