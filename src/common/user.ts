/**
 * Classe che definisce un utente del gioco mastermind
 */
export default class User {
    private _nickname: string;

    private _points: number;

    private _tries: Array<string>;

    private _currentTry:string;

    constructor(nickname = '', points = 0) {
      this._nickname = nickname;
      this._points = points;
      this._tries = [];
      this._currentTry = 'eeeee';
    }

    /**
     * Agginge il numero di punti specificato al punteggio
     * @param points numero di punti da aggiungere al punteggio, se non specificato vale 1
     */
    public addPoints(points = 1):void {
      this._points += points;
    }

    set points(points:number) {
      this._points = points;
    }

    get points():number {
      return this._points;
    }

    set nickname(name:string) {
      this._nickname = name;
    }

    get nickname():string {
      return this._nickname;
    }

    /**
     * Assegnazione del tentativo corrente. Il tentativo viene aggiunto allo storico dei tentativi
     * @param userTry codice che l'utente vuole confrontare con il codice segreto
     */
    set currentTry(userTry:string) {
      this._currentTry = userTry;
      this._tries.push(userTry);
    }

    get currentTry():string {
      return this._currentTry;
    }

    set tries(userTries:Array<string>) {
      if (userTries) {
        this._tries = userTries;
      }
    }

    get tries():Array<string> {
      return this._tries;
    }
}
