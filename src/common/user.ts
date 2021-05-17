export class User {
    private _nickname: string;
    private _points: number;

    constructor(nickname:string = ''){
        this._nickname = nickname;
        this._points = 0;
    }

    // di base aumenta di 1, se il sistema di punteggio cambia i punti possono essere > 1
    public addPoints(points = 1){
        this._points += points;
    }

    public set points(points:number){
        this._points = points;
    }

    public get points(){
        return this._points;
    }

    public set nickname(name:string){
        this._nickname = name;
    }

    public get nickname(){
        return this._nickname;
    }

}