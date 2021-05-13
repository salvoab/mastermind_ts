import {createMachine, EventObject, interpret, send, StateMachine, assign } from 'xstate';
import { MastermindContext, MastermindEvent, MastermindSchema } from './types';
import { InputService } from '../common/inputService';
import {MastermindService} from '../common/mastermindService';
import { raise } from 'xstate/lib/actions';


export class MastermindMachine{
    private _machine:any;
    private _interpret:any;

    constructor(private _inputService:InputService, private _mastermindService:MastermindService){
        this._inputService = _inputService;
        this._mastermindService = _mastermindService;

        this._machine = createMachine({
            id: "mastermind",
            initial: "starter",
            context: {
                // TO-DO generare il codice in maniera randomica
                secretCode: 'EEEEE', 
                userCode: 'eeeee',
                keepPlay: false
            },
            states: {
                starter: {
                    entry: 'getSecretCode',
                    on:{
                        OK: {target: 'validCode'},
                        ERROR: {target: 'error'},
                    }
                },
                validCode: {
                    //entry: ['recuperaCodice'],
                    invoke: {
                        id: 'getUserCode',
                        src: (context, event) => this._inputService.recuperaCodiceValido(),
                        onDone: {
                            target: 'calculator',
                            actions: assign({ userCode: (context, event) => event.data })
                        }
                    },
                    on:{
                        //OK: {target: 'calculator'},
                        KO: {target: 'starter'},
                        ERROR: {target: 'error'}
                    }
                },
                calculator: {
                    entry: ['calcola'],
                    on:{
                        WIN: {target: 'matchResult'},
                        LOSE: {target: 'matchResult'},
                        ERROR: {target: 'error'}
                    }
                },
                matchResult: {
                    entry: ['risultatoPartita'],
                    on:{
                        OK: {target: "keepPlaying"}
                    }
                },
                keepPlaying: {
                    invoke: {
                        id: 'askToPlayAgain',
                        src: (context, event) => this._inputService.chiediDiContinuare(),
                        onDone: {
                            actions: 'checkAnswer'
                        }
                    },
                    on: {
                        CONTINUE: {target: 'validCode'},
                        STOP: {target: 'end'}
                    }
                },
                end: {
                    entry: 'stopGame',
                    type: 'final'
                },
                error: {
                    type: "final"
                }

            },
        },
        {
            actions: {
                getSecretCode: send((context, event) =>{
                    context['secretCode'] = this._mastermindService.secretCode;
                    console.log('Il codice Segreto recuperato è: ' + context['secretCode']);
                    //this._interpret.send('OK');
                    return ( {type: 'OK'} );
                }),

                calcola: send((context, event) => {
                    const result = this._mastermindService.checkWin(context['userCode']);
                    console.log(result);
                    if( result === "WIN")
                        return { type: 'WIN' };
                    
                    return { type: 'LOSE' };
                }),

                risultatoPartita: send((context, event) => {
                    if(event.type === "WIN")
                        console.log('HAI VINTO');
                    else
                        console.log('Mi dispiace, hai perso');
                    
                    return {type: 'OK'};
                }),

                checkAnswer: send((context, event) => {                 
                    if(event['data'])
                        return {type: 'CONTINUE'}
                    return {type: 'STOP'}
                }),

                stopGame: (context, event) => {
                    this._inputService.chiudiReadline();
                }
            }
        });

        this._interpret = interpret(this._machine);//.onTransition((state)=> console.log(state.value));
    }

    get machine(){
        return this._machine;
    }

    get interpret(){
        return this._interpret;
    }
}