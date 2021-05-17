export interface MastermindContext{
    try: number
}

export type MastermindEvent =
    | { type: 'OK' }
    | { type: 'KO' }
    | { type: 'WIN' }
    | { type: 'LOSE' };

export type MastermindState = {
    value: string;
    on : {
        OK?: MastermindEvent,
        KO?: MastermindEvent,
        WIN?: MastermindEvent,
        LOSE?: MastermindEvent
    }
}

/*
export type MastermindSchema = {
    type: 'insert' | 'validCode' | 'calculator' | 'end';
    states: {
        insert: {};
        validCode: {};
        calculator: {};
        end: {};
    }
}*/
