import {
  createMachine, interpret, send,
} from 'xstate';
import InputService from '../common/inputService';
import MastermindService from '../common/mastermindService';
import User from '../common/user';
import { UsersService } from '../common/userService';
import { Logger } from 'tslog'

/**
 * Classe per la definizione e l'utilizzo della macchina a stati finiti che descrive il flusso del gioco mastermind
 */
export default class MastermindMachine {
    private _machine:any;

    private _interpret:any;

    private log: Logger;

    constructor(private _inputService:InputService, private _mastermindService:MastermindService, private _usersService:UsersService) {
      this._inputService = _inputService;
      this._mastermindService = _mastermindService;
      this._usersService = _usersService;
      this.log = new Logger();

      this._machine = createMachine({
        id: 'mastermind',
        initial: 'loader',
        context: {
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
            invoke: {
              id: 'getNickname',
              src: (context, event) => this._inputService.recuperaNickname(),
              onDone: {
                actions: ['playersSetup', 'getSecretCode'],
              },
            },
            on: {
              OK: { target: 'askUserCode' },
              ERROR: { target: 'error' },
            },
          },
          askUserCode: {
            invoke: {
              id: 'getUserCode',
              src: (context, event) => {
                const isInvalidCode = event['data'] === 'Non valido';
                return this._inputService.recuperaCodice(isInvalidCode);
              },
              onDone: {
                target: 'update',
                actions: 'updateTries',
              },
              onError: {
                target: 'askUserCode'
              }
            },
            on: {
              ERROR: { target: 'error' },
            }
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
              CONTINUE: { target: 'askUserCode' },
              STOP: { target: 'end' },
            },
          },
          end: {
            entry: 'stopGame',
            type: 'final',
          },
          error: {
            type: 'final',
          }
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
            context.actualPlayer = this._usersService.getUser(context, event['data']);
          },

          getSecretCode: send((context, event) => {
            context.secretCode = this._mastermindService.secretCode;
            this.log.silly(`Il codice Segreto recuperato è: ${context.secretCode}`);

            return ({ type: 'OK' });
          }),

          updateTries: (context, event) => {
            context.actualPlayer.currentTry = event['data'];
            this._usersService.updateUser(context);
          },

          updating: send((context, event) => {
            this.log.silly('Updating...');
            return { type: 'OK' };
          }),

          calcola: send((context, event) => {
            const result = this._mastermindService.checkWin(context.actualPlayer.currentTry);
            this.log.silly(result);
            if (result === 'WIN') {
              return { type: 'WIN' };
            }

            return { type: 'LOSE' };
          }),

          risultatoPartita: send((context, event) => {
            if (event.type === 'WIN') {
              this.log.silly(`${context.actualPlayer.nickname} HAI VINTO`);
              context.actualPlayer.addPoints();
              this._usersService.updateUser(context);
              this.log.silly(`Il tuo punteggio è: ${context.actualPlayer.points} punti`);
              // Generazione del nuovo codice Segreto
              context.secretCode = this._mastermindService.generateCode();
              this.log.silly('Il nuovo codice segreto: ' + context.secretCode);
            } else {
              this.log.silly(`Mi dispiace ${context.actualPlayer.nickname}: Hai perso`);
            }

            return { type: 'OK' };
          }),

          checkAnswer: send((context, event) => {
            if (event['data']) { return { type: 'CONTINUE' }; }
            return { type: 'STOP' };
          }),

          stopGame: (context, event) => {
            this._usersService.saveMachine(context, './src/data/machineContext.json');
            this._inputService.chiudiReadline();
          },
        },
      });

      this._interpret = interpret(this._machine);// .onTransition((state)=> this.log.silly(state.value));
    }

    get machine() {
      return this._machine;
    }

    get interpret() {
      return this._interpret;
    }
}
