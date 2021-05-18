export default class MastermindService {
    _secretCode:string;

    constructor() {
      this.generateCode();
    }

    get secretCode():string{
      return this._secretCode;
    }

    generateCode():string{
      let randomCode = '';
      for (let i = 0; i < 5; i += 1) {
        randomCode += Math.floor(Math.random() * 10).toString();
      }
      this._secretCode = randomCode;
      return randomCode;
    }

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

    checkWin(userCode:string):string {
      const { position, matched } = this.checkCode(userCode);
      if (matched === 5 && position === 5) { return 'WIN'; }
      return `posizione(${position}) giusto(${matched})`;
    }
}
