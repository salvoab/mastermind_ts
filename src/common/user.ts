export class User {
    private _nickname: string;
    private _points: number;

    constructor(nickname:string = '', points:number = 0){
        this._nickname = nickname;
        this._points = points;
    }

    // di base aumenta di 1, se il sistema di punteggio cambia i punti possono essere > 1
    public addPoints(points = 1){
        this._points += points;
    }

    set points(points:number){
        this._points = points;
    }

    get points(){
        return this._points;
    }

    set nickname(name:string){
        this._nickname = name;
    }

    get nickname(){
        return this._nickname;
    }

}