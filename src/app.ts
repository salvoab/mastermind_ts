/*
Creare un programma che legga da linea di comando, e controlli se il codice immesso è uguale al codice segreto.
*/

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const CODICE_SEGRETO = "1234"

function checkCode(code:string):string{
    if(code == CODICE_SEGRETO)
        return "Complimenti hai indovinato il codice segreto";
    return "Codice errato";
}

function main():string{
    rl.question('Inserisci il codice segreto: ', (answer:string) => {
        
        console.log( checkCode(answer) );
        
        rl.close();
    });
    return "fine";
}

main()