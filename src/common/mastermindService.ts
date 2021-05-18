/**
 * Classe contenente la logica di gioco del mastermind
 */
export default class MastermindService {
    _secretCode:string;

    constructor() {
      this.generateCode();
    }

    /**
     * Genera il codice segreto
     * @returns il nuovo codice generato
     */
    generateCode():string{
      let randomCode = '';
      for (let i = 0; i < 5; i += 1) {
        randomCode += Math.floor(Math.random() * 10).toString();
      }
      this._secretCode = randomCode;
      return randomCode;
    }

    /**
     * Confronta il codice da testare con il codice segreto e restituisce un object literal che definisce il numero di posizioni e il numero di caratteri indovinati
     * @param userCode codice da testare
     * @returns object literal con proprietà position per il numero di posizioni corrette e la proprietà matched per il numero di caratteri corretti
     */
    checkCode(userCode:string):{position:number, matched:number} {
      const rowSecretCode = this._secretCode.split('');
      const rowUserCode = userCode.split('');

      for (let i = 0; i < this._secretCode.length; i += 1) {
        if (rowSecretCode[i] === rowUserCode[i]) {
          rowSecretCode[i] = 'T';
          rowUserCode[i] = 'T';
        }
      }
      const remainingSecret = rowSecretCode.filter((element) => element !== 'T');
      const remainingUserCode = rowUserCode.filter((element) => element !== 'T');

      for (let i = 0; i < remainingSecret.length; i += 1) {
        const index = remainingSecret.findIndex((element) => remainingUserCode[i] === element);
        if (index !== -1) {
          remainingSecret[index] = 'M';
        }
      }

      const position = this._secretCode.length - remainingSecret.length;
      const matched = position + remainingSecret.filter((element) => element === 'M').length;

      return { position, matched };
    }

    /**
     * Confronta il codice da testare con il codice segreto e restituisce una stringa che descrive il numero di posizioni e il numero di caratteri indovinati
     * @param userCode codice da testare
     * @returns stringa del formato posizione(x) giusto(y) con x numero di posizioni esatte e y con il numero di caratteri indovinati
     */
    checkWin(userCode:string):string {
      const { position, matched } = this.checkCode(userCode);
      if (matched === 5 && position === 5) { return 'WIN'; }
      return `posizione(${position}) giusto(${matched})`;
    }

    get secretCode():string{
      return this._secretCode;
    }

    set secretCode(secretCode:string){
      this._secretCode = secretCode;
    }
}
