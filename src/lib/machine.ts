import {createMachine, EventObject, interpret, send, StateMachine } from 'xstate';
import { MastermindContext, MastermindEvent, MastermindSchema } from './types';
import { InputService } from '../common/inputService';
import {MastermindService} from '../common/mastermindService';


export class MastermindMachine{
    private _machine:any;
    private _interpret:any;

    constructor(private _inputService:InputService, private _mastermindService:MastermindService){
        this._inputService = _inputService;
        this._mastermindService = _mastermindService;

        this._machine = createMachine({
            id: "mastermind",
            initial: "insert",
            context: {
                // TO-DO generare il codice in maniera randomica
                secretCode: 'EEEEE', 
                userCode: 'eeeee'
            },
            states: {
                insert: {
                    entry: ['getSecretCode'],
                    on:{
                        OK: {target: 'validCode'},
                        ERROR: {target: 'error'},
                    }
                },
                validCode: {
                    entry: ['recuperaCodice'],
                    on:{
                        OK: {target: 'calculator'},
                        KO: {target: 'insert'},
                        ERROR: {target: 'error'}
                    }
                },
                calculator: {
                    entry: ['calcola'],
                    on:{
                        WIN: {target: 'end'},
                        LOSE: {target: 'end'},
                        ERROR: {target: 'error'}
                    }
                },
                end: {
                    entry: ['risultatoPartita'],
                    type: "final"
                },
                error: {
                    type: "final"
                }

            },
        },
        {
            actions: {
                getSecretCode: (context, event) =>{
                    context.secretCode = this._mastermindService.secretCode;
                    console.log('Il codice Segreto recuperato è: ' + context.secretCode);
                    this._interpret.send('OK');
                },
                recuperaCodice: (context, event) => {
                    this._inputService.recuperaCodiceValido().then(result => {
                        context.userCode = result
                        //console.log('Codice utente recuperato: ' + context.userCode);
                        this._interpret.send('OK');
                    });
                },

                calcola: (context, event) => {
                    const result = this._mastermindService.checkWin(context.userCode);
                    console.log(result);
                    if( result === "WIN")
                        this._interpret.send('WIN');
                    else
                        this._interpret.send('LOSE');
                    
                },

                risultatoPartita: (context, event) => {
                    if(event.type === "WIN")
                        console.log('HAI VINTO');
                    else
                        console.log('Mi dispiace, hai perso');
                        
                    this._inputService.chiudiReadline();
                    this._interpret.stop();
                }
            }
        });

        this._interpret = interpret(this._machine).onTransition((state)=> console.log(state.value));
    }

    get machine(){
        return this._machine;
    }

    get interpret(){
        return this._interpret;
    }
}