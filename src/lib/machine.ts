import {createMachine, interpret, send, assign } from 'xstate';
import { InputService } from '../common/inputService';
import {MastermindService} from '../common/mastermindService';
import {User} from '../common/user';

const fs = require('fs');



export class MastermindMachine{
    private _machine:any;
    private _interpret:any;

    constructor(private _inputService:InputService, private _mastermindService:MastermindService){
        this._inputService = _inputService;
        this._mastermindService = _mastermindService;

        this._machine = createMachine({
            id: "mastermind",
            initial: "loader",
            context: {
                // TO-DO generare il codice in maniera randomica
                secretCode: 'EEEEE', 
                userCode: 'eeeee',
                player: new User()
            },
            states: {
                loader: {
                    entry: 'loadContext',
                    on:{
                        LOADED: {target: 'validCode'},
                        NO_PLAYER: {target: 'starter'}
                    }
                },
                starter: {
                    //entry: 'getSecretCode',
                    invoke:{
                        id: 'getNickname',
                        src: (context, event) => this._inputService.recuperaNickname(),
                        onDone: {
                            actions: ['setNickname', 'getSecretCode']
                        }
                    },
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
                loadContext: send((context, event)=>{
                    if( fs.existsSync('./src/data/machineContext.json') ){
                        const oldContext = JSON.parse( fs.readFileSync('./src/data/machineContext.json') );
                        console.log(oldContext.secretCode, oldContext.player._nickname);
                        context['secretCode'] = oldContext.secretCode;
                        context['player'].nickname = oldContext.player._nickname;
                        context['player'].points = oldContext.player._points;
                        return {type: 'LOADED'}
                    }

                    return {type: 'NO_PLAYER'}
                }),

                setNickname: (context, event) => {
                    context['player'].nickname = event['data'];
                    //console.log(context);
                },

                getSecretCode: send((context, event) =>{
                    context['secretCode'] = this._mastermindService.secretCode;
                    console.log('Il codice Segreto recuperato è: ' + context['secretCode']);
                    //this._interpret.send('OK');
                    return ( {type: 'OK'} );
                }),

                calcola: send((context, event) => {
                    const result = this._mastermindService.checkWin(context['userCode']);
                    console.log(result);
                    if( result === "WIN"){
                        return { type: 'WIN' };
                    }
                    
                    return { type: 'LOSE' };
                }),

                risultatoPartita: send((context, event) => {
                    if(event.type === "WIN"){
                        console.log(context['player'].nickname + ' HAI VINTO');
                        context['player'].addPoints();
                        console.log('Il tuo punteggio è: ' + context['player'].points + ' punti');
                    }
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
                    fs.promises.mkdir('./src/data', { recursive: true }).catch(console.error);
                    fs.writeFileSync('./src/data/machineContext.json', JSON.stringify(context));
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