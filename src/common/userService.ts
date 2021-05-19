import User from './user';
import { Logger } from 'tslog';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

/**
 * Classe per la gestione degli utenti
 */
export class UsersService {

  private log:Logger;

  constructor(){
    this.log = new Logger();
  }

  /**
   * Dato un riferimento al contesto della macchina e il nickname di un giocatore, verifica che nella lista giocatori del contesto della macchina,
   * sia presente un giocatore con nickname specificato.
   * Se presente allora restituisce il riferimento a tale giocatore. Se non è presente crea un nuovo giocatore con il 
   * nickname specificato e lo aggiunge alla lista dei giocatori.
   * @param machineContext riferimento al contesto della macchina a stati finiti
   * @param nickname nickname del giocatore
   * @returns una nuova istanza di un oggetto di classe User se il nickname del giocatore non è presente nella lista giocatori, 
   * un riferimento all'oggetto con nickname specificato se il nickname del giocatore è presente nella lista giocatori
   */
  public getUser(machineContext, nickname:string):User {
    const retrivedPlayer = machineContext.players.find((player) => player.nickname === nickname);
    if (retrivedPlayer) {
      // console.log('recuperato', retrivedPlayer);
      return retrivedPlayer;
    }

    const newPlayer = new User(nickname);
    machineContext.players.push(newPlayer);
    // console.log('nuovo utente inserito in', machineContext['players']);
    return newPlayer;
  }

  /**
   * Cerca nella lista giocatori, presente nel contesto della macchina, il giocatore attuale (actualPlayer) e ne aggiorna i valori 
   * @param machineContext contesto della macchina a stati finiti
   */
  public updateUser(machineContext):void {
    const actualPlayerPosition = machineContext.players.findIndex((player) => player === machineContext.actualPlayer);
    machineContext.players[actualPlayerPosition] = machineContext.actualPlayer;
  }

  /**
   * Cancella, se presente, il giocatore con nickname specificato dalla lista di giocatori presente all'interno del contesto della macchina a stati finiti.
   * @param machineContext riferimento al contesto della macchina a stati finiti
   * @param nickname nickname del giocatore
   * @returns oggetto di classe User che rappresenta il giocatore eliminato dalla lista giocatori nel contesto della macchina a stati finiti,
   * null se non esiste nella lista giocatori un giocatore con il nickname specificato
   */
  public deleteUser(machineContext, nickname:string):User {
    const playerPosition = machineContext.players.findIndex((player) => player.nickname === nickname);
    if (playerPosition > -1) {
      const deletedPlayer = machineContext.players[playerPosition];
      machineContext.players.splice(playerPosition, 1);
      return deletedPlayer;
    }

    return null;
  }

  /**
   * Dato il riferimento al contesto della macchina a stati finiti (machineContext) e il percorso del file json in cui è memorizzato lo stato di una macchina a stati finiti,
   * carica in machineContext i dati contenuti all'interno del file json indicato.
   * @param machineContext riferimento al contesto della macchina a stati finiti
   * @param machineContextPath percorso compreso di nome file ed estensione .json del file json contenente il contesto della macchina da caricare
   * @returns true se il contesto della macchina viene caricato, false altrimenti
   */
  public loadMachine(machineContext, machineContextPath:string):boolean {
    if (fs.existsSync(machineContextPath)) {
      const oldContext = JSON.parse(fs.readFileSync(machineContextPath));
      // console.log(oldContext.players);
      oldContext.players.forEach((player) => {
        const newUser = new User(player._nickname, player._points);
        newUser.tries = player._tries;
        machineContext.players.push(newUser);
      });
      // console.log('loaded: ', machineContext['players']);
      return true;
    }

    return false;
  }

  /**
   * Dato il riferimento al contesto della macchina a stati finiti (machineContext) e il percorso del file json in cui salvare il contesto della macchina,
   * genera il file json indicato da machineContextPath contente le informazioni presenti nel machineContext.
   * Se il file esiste già allora viene sovrascritto.
   * @param machineContext riferimento al contesto della macchina a stati finiti
   * @param machineContextPath percorso compreso di nome file ed estensione .json del file json in cui salvare il contesto della macchina a stati finiti
   */
  public saveMachine(machineContext, machineContextPath:string):void {
    const directoryPath = path.dirname(machineContextPath);
    fs.promises.mkdir(directoryPath, { recursive: true }).catch(error => this.log.error(error));
    fs.writeFileSync(machineContextPath, JSON.stringify(machineContext));
  }
}
