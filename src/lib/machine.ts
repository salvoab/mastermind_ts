import {createMachine, interpret, StateMachine } from 'xstate';
import { MastermindContext, MastermindEvent, MastermindSchema } from './types';

export class MastermindMachine{
    private _machine:StateMachine<MastermindContext, MastermindSchema, MastermindEvent>;
    private _interpret:any;

    constructor(){
        this._machine = createMachine<MastermindContext, MastermindSchema, MastermindEvent>({
            id: "mastermind",
            initial: "insert",
            states: {
                insert: {
                    value: 'INSERT',

                    on:{
                        OK: {target: 'validCode'}
                    }
                },
                validCode: {
                    on:{
                        OK: {target: 'calculator'},
                        KO: {target: 'insert'}
                    }
                },
                calculator: {
                    on:{
                        WIN: {target: 'end'},
                        LOSE: {target: 'end'}
                    }
                },
                end: {
                    type: "final"
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