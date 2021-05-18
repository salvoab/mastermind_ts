import readline from 'readline';

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

    chiudiReadline():void {
      this.rl.close();
    }

    async recuperaNickname():Promise<string> {
      return new Promise((resolve) => {
        this.rl.question('Inserisci il nickname del giocatore: ', (answer:string) => resolve(answer));
      });
    }

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
