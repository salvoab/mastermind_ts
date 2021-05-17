import {
  createMachine, interpret, send,
} from 'xstate';
import InputService from '../common/inputService';
import { MastermindService } from '../common/mastermindService';
import { User } from '../common/user';
import { UsersService } from '../common/userService';

export default class MastermindMachine {
    private _machine:any;

    private _interpret:any;

    constructor(private _inputService:InputService, private _mastermindService:MastermindService, private _usersService:UsersService) {
      this._inputService = _inputService;
      this._mastermindService = _mastermindService;
      this._usersService = _usersService;

      this._machine = createMachine({
        id: 'mastermind',
        initial: 'loader',
        context: {
          // TO-DO generare il codice in maniera randomica
          secretCode: 'EEEEE',
          players: [],
          actualPlayer: new User('guest'),
        },
        states: {
          loader: {
            entry: 'loadContext',
            on: {
              LOADED: { target: 'starter' },
              NO_PLAYER: { target: 'starter' },
            },
          },
          starter: {
            // entry: 'getSecretCode',
            invoke: {
              id: 'getNickname',
              src: (context, event) => this._inputService.recuperaNickname(),
              onDone: {
                actions: ['playersSetup', 'getSecretCode'],
              },
            },
            on: {
              OK: { target: 'validCode' },
              ERROR: { target: 'error' },
            },
          },
          validCode: {
            // entry: ['recuperaCodice'],
            invoke: {
              id: 'getUserCode',
              src: (context, event) => this._inputService.recuperaCodiceValido(),
              onDone: {
                target: 'update',
                // chiamare getUser e dell'utente restituito fare l'update dei try tramite metodi appositi
                // actions: assign({ userCode: (context, event) => event.data })
                actions: 'updateTries',
              },
            },
            on: {
              // OK: {target: 'calculator'},
              KO: { target: 'starter' },
              ERROR: { target: 'error' },
            },
          },

          update: {
            entry: 'updating',
            on: {
              OK: { target: 'calculator' },
            },
          },

          calculator: {
            entry: ['calcola'],
            on: {
              WIN: { target: 'matchResult' },
              LOSE: { target: 'matchResult' },
              ERROR: { target: 'error' },
            },
          },
          matchResult: {
            entry: ['risultatoPartita'],
            on: {
              OK: { target: 'keepPlaying' },
            },
          },
          keepPlaying: {
            invoke: {
              id: 'askToPlayAgain',
              src: (context, event) => this._inputService.chiediDiContinuare(),
              onDone: {
                actions: 'checkAnswer',
              },
            },
            on: {
              CONTINUE: { target: 'validCode' },
              STOP: { target: 'end' },
            },
          },
          end: {
            entry: 'stopGame',
            type: 'final',
          },
          error: {
            type: 'final',
          },

        },
      },
      {
        actions: {
          loadContext: send((context, event) => {
            const oldMachineContextPath = './src/data/machineContext.json';
            if (this._usersService.loadMachine(context, oldMachineContextPath)) {
              return { type: 'LOADED' };
            }

            return { type: 'NO_PLAYER' };
          }),

          playersSetup: (context, event) => {
            context.actualPlayer = this._usersService.getUser(context, event.data);
          },

          getSecretCode: send((context, event) => {
            context.secretCode = this._mastermindService.secretCode;
            console.log(`Il codice Segreto recuperato è: ${context.secretCode}`);

            return ({ type: 'OK' });
          }),

          updateTries: (context, event) => {
            context.actualPlayer.currentTry = event.data;
            this._usersService.updateUser(context);
          },

          updating: send((context, event) => {
            console.log('Updating...');
            return { type: 'OK' };
          }),

          calcola: send((context, event) => {
            const result = this._mastermindService.checkWin(context.actualPlayer.currentTry);
            console.log(result);
            if (result === 'WIN') {
              return { type: 'WIN' };
            }

            return { type: 'LOSE' };
          }),

          risultatoPartita: send((context, event) => {
            if (event.type === 'WIN') {
              console.log(`${context.actualPlayer.nickname} HAI VINTO`);
              context.actualPlayer.addPoints();
              this._usersService.updateUser(context);
              console.log(`Il tuo punteggio è: ${context.actualPlayer.points} punti`);
            } else {
              console.log(`Mi dispiace ${context.actualPlayer.nickname}: Hai perso`);
            }

            return { type: 'OK' };
          }),

          checkAnswer: send((context, event) => {
            if (event.data) { return { type: 'CONTINUE' }; }
            return { type: 'STOP' };
          }),

          stopGame: (context, event) => {
            // fs.promises.mkdir('./src/data', { recursive: true }).catch(console.error);
            // fs.writeFileSync('./src/data/machineContext.json', JSON.stringify(context));
            this._usersService.saveMachine(context, './src/data/machineContext.json');
            this._inputService.chiudiReadline();
          },
        },
      });

      this._interpret = interpret(this._machine);// .onTransition((state)=> console.log(state.value));
    }

    get machine() {
      return this._machine;
    }

    get interpret() {
      return this._interpret;
    }
}
