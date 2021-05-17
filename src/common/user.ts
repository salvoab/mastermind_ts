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

    // di base aumenta di 1, se il sistema di punteggio cambia i punti possono essere > 1
    public addPoints(points = 1) {
      this._points += points;
    }

    set points(points:number) {
      this._points = points;
    }

    get points() {
      return this._points;
    }

    set nickname(name:string) {
      this._nickname = name;
    }

    get nickname() {
      return this._nickname;
    }

    set currentTry(userTry:string) {
      this._currentTry = userTry;
      this._tries.push(userTry);
    }

    get currentTry() {
      return this._currentTry;
    }

    set tries(userTries:Array<string>) {
      if (userTries) {
        this._tries = userTries;
      }
    }

    get tries() {
      return this._tries;
    }
}
