import readline from 'readline';

/**
 * Classe per la gestione degli input da terminale
 */
export default class InputService {
    private rl;

    private INVALID_CODE = 'Non valido';

    private SECRET_CODE_LENGTH = 5;

    constructor() {
      this.rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
    }

    // REGOLA GENERALE:
    // Prima tutti i metodi pubblici poi i privati e in fondo i metodi getter e setter

    /**
     * Chiude il readline
     */
    chiudiReadline():void {
      this.rl.close();
    }

    /**
     * Chiede all'utente di inserire da terminale un nickname
     * @returns oggetto Promise che rappresenta la stringa col nickname inserito dall'utente
     */
    async recuperaNickname():Promise<string> {
      return new Promise((resolve) => {
        this.rl.question('Inserisci il nickname del giocatore: ', (answer:string) => resolve(answer));
      });
    }

    /**
     * Chiede all'utente, tramite terminale, se vuole continuare a giocare
     * @returns oggetto Promise che rappresenta il booleano true se l'utente sceglie di continuare, false altrimenti
     */
    async chiediDiContinuare():Promise<boolean> {
      return new Promise((resolve) => {
        this.rl.question('Vuoi continuare? [S/N]: ', (answer:string) => {
          resolve(answer.toUpperCase() === 'S');
        });
      });
    }
    /*
    async recuperaCodiceValido():Promise<string> {
      try {
        let result = await this.recuperaCodice(false);

        while (this.INVALID_CODE === result) {
          console.log(`Il codice che hai inserito non è lungo ${this.SECRET_CODE_LENGTH} caratteri`);
          result = await this.recuperaCodice(true);
        }
        return result;
      } catch (error) {
        console.log(error);
        return this.INVALID_CODE;
      }
    }*/

    /**
     * Chiede all'untente, tramite terminale, di inserire un codice formato da 5 caratteri.
     * Se il codice inserito è di 5 caretteri la Promise risolve con il codice inserito, altrimenti rigetta con la stringa "Non valido"
     * @param repeated Passare false se si vuole scrivere la domanda iniziale, true se si vuole che la domanda sia diversa perché chiesta non per la prima volta
     * @returns oggetto Promise che rappresenta la stringa con il codice correttamente inserito, o il reject con la stringa "Non valido"
     */
    public async recuperaCodice(repeated:boolean):Promise<string> {
      return new Promise((resolve, reject) => {
        let domanda:string;

        if (repeated) { domanda = `Reinserisci il codice segreto: di ${this.SECRET_CODE_LENGTH} caratteri: `; } else { domanda = `Inserisci il codice segreto di ${this.SECRET_CODE_LENGTH} caratteri: `; }

        this.rl.question(domanda, (code:string) => {
          if (this.SECRET_CODE_LENGTH !== code.length) {
            reject(this.INVALID_CODE);
          } else {
            resolve(code);
          }
        });
      });
    }
}
