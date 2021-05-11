import readline  from 'readline'

export class inputService {
    private rl;
    private INVALID_CODE = "Non valido";

    constructor(){
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    // REGOLA GENERALE: Prima tutti i metodi pubblici poi i privati e in fondo i metodi getter e setter

    chiudiReadline(){
        this.rl.close();
    }

    async chiediDiContinuare():Promise<boolean> {
        return new Promise((resolve, reject) => {  

            this.rl.question("Vuoi continuare? [S/N]: ", (answer:string) => {               
                if("S" === answer.toUpperCase())
                    resolve(true);
                else
                    resolve(false);
            })
            
        })
    }

    async recuperaCodiceValido():Promise<string>{
        try {
            let result = await this.recuperaCodice(false);

            while (this.INVALID_CODE === result) {
                console.log("Il codice che hai inserito non è lungo 4 caratteri");
                result = await this.recuperaCodice(true);
            } 
            return result;
        } 
        catch (error){
            console.log(error);
            return this.INVALID_CODE;
        }
    }

    private async recuperaCodice(repeated:boolean):Promise<string> {
        return new Promise((resolve, reject) => {
            let domanda:string;

            if(repeated)
                domanda = "Reinserisci il codice segreto: ";
            else 
                domanda = "Inserisci il codice segreto di 5 caratteri: ";
            
            this.rl.question(domanda, (code:string) => {               
                if (code.length !== 5){
                    resolve(this.INVALID_CODE);
                }
                else{
                    resolve(code);
                }
                
            })
            
        })
    }

}