/*
Creare un programma che legga da linea di comando, e controlli se il codice immesso è uguale al codice segreto.
*/

// import di librerie
//import { createMachine, interpret, actions } from 'xstate';

// si lascia uno spazio e si importano le classi necessarie
import MastermindMachine from './lib/machine';
import MastermindService from './common/mastermindService';
import InputService from './common/inputService';
import { UsersService } from './common/userService';

// si lascia uno spazio e si dichiarano le costanti

const CODICE_SEGRETO = '12343';

/* async function main(){
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
  const myMachine = new MastermindMachine(new InputService(), new MastermindService(), new UsersService());
  myMachine.interpret.start();
  /* myMachine.interpret.send({type: 'OK'});
  myMachine.interpret.send({type: 'OK'});
  const currentState = myMachine.interpret.send({type: 'OK'});

  console.log(currentState.nextEvents); */

  return 'fine';
}

/*
function main2(){

const { log } = actions;

const loggingMachine = createMachine({
  id: 'logging',
  context: { count: 42 },
  initial: 'start',
  states: {
    start: {
      entry: log('started!'),
      on: {
        FINISH: {
          target: 'end',
          actions: [log(
            (context, event) => `count: ${context['count']}, event: ${event.type}`,
            'Finish label'
          )]
        }
      }
    },
    end: {
      entry: [log('end!')]
    }
  }
});

const endState = loggingMachine.transition('start', 'FINISH');
//console.log(endState.value);

//console.log(endState.actions);
endState.actions
//log('ciao');

// [
//   {
//     type: 'xstate.log',
//     label: 'Finish label',
//     expr: (context, event) => ...
//   }
// ]

// The interpreter would log the action's evaluated expression
// based on the current state context and event.

}
*/

main().then((message) => console.log(message)).catch((error) => console.log(error));
// main2();
