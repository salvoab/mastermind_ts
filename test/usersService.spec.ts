import 'mocha';
import { assert } from 'chai';
import { UsersService } from '../src/common/userService';
import User from '../src/common/user';

describe('UsersServiceTest', () => {
  let service;
  let machineContext;
  beforeEach(() => {
    service = new UsersService();
    machineContext = {
      secretCode: 'EEEEE',
      players: [],
      actualPlayer: new User('guest'),
    };
  });
  // afterEach(() => {
  // });
  it('getUser first test', async () => {
    const result = service.getUser(machineContext, 'giocatore1');
    assert.instanceOf(result, User);
    assert.equal(result.nickname, 'giocatore1');
    assert.isArray(result.tries);
    assert.equal(result.tries.length, 0);
  });
  it('getUser second test', async () => {
    const giocatore1 = new User('giocatore1');
    giocatore1.addPoints();
    machineContext.players = [giocatore1, new User('giocatore2')];

    const result = service.getUser(machineContext, 'giocatore1');
    assert.instanceOf(result, User);
    assert.equal(result.nickname, 'giocatore1');
    assert.equal(result.points, 1);
  });
  it('updateUser test', async () => {
    const giocatore2 = new User('giocatore2');
    machineContext.players = [new User('giocatore1'), giocatore2];
    machineContext.actualPlayer = giocatore2;
    // giocatore2 indovina il codice e passa da 0 punti a 1 punto
    machineContext.actualPlayer.currentTry = '12343';
    machineContext.actualPlayer.addPoints();

    service.updateUser(machineContext);
    assert.equal(machineContext.players[1].currentTry, '12343');
    assert.deepEqual(machineContext.players[1].tries, ['12343']);
    assert.equal(machineContext.players[1].points, 1);
  });
  it('deleteUser first test', async () => {
    const giocatore2 = new User('giocatore2');
    giocatore2.addPoints();
    machineContext.players = [new User('giocatore1'), giocatore2];

    const result = service.deleteUser(machineContext, 'giocatore2');
    assert.deepEqual(result, giocatore2);
    assert.equal(machineContext.players.length, 1);
  });
  it('deleteUser second test', async () => {
    const giocatore2 = new User('giocatore2');
    giocatore2.addPoints();
    machineContext.players = [new User('giocatore1'), giocatore2];

    const result = service.deleteUser(machineContext, 'giocatore3');
    assert.equal(result, null);
    assert.equal(machineContext.players.length, 2);
  });
  it('loadMachine first test', async () => {
    const result = service.loadMachine(machineContext, './test/data/testMachineContext.json');
    assert.equal(result, true);
    assert.equal(machineContext.players.length, 1);
    assert.equal(machineContext.players[0].points, 2);
    assert.deepEqual(machineContext.players[0].tries, ["32145","12333","12343"]);
    assert.equal(machineContext.actualPlayer.nickname, 'guest');
  });
  it('loadMachine second test', async () => {
    const result = service.loadMachine(machineContext, './test/data/noMachineContext.json');
    assert.deepEqual(result, false);
    assert.equal(machineContext.players.length, 0);
    assert.equal(machineContext.actualPlayer.nickname, 'guest');
  });
});
