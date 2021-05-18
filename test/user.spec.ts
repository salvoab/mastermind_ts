import 'mocha';
import { assert } from 'chai';
import User from '../src/common/user';

describe('User Test', () => {
  let testUser;
  beforeEach(() => {
    testUser = new User('test');
  });
  // afterEach(() => {
  // });
  it('set tries and get tries first test', async () => {
    testUser.tries = ['12345', '32145'];
    assert.deepEqual(testUser.tries, ['12345', '32145']);
  });
  it('set tries and get tries second test', async () => {
    testUser.tries = ['12345', '32145'];
    testUser.tries = undefined;
    assert.deepEqual(testUser.tries, ['12345', '32145']);
  });
  it('set points and get points test', async () => {
    testUser.points = 10;
    assert.equal(testUser.points, 10);
  });
  it('set nickname and get nickname test', async () => {
    testUser.nickname = 'mario';
    assert.equal(testUser.nickname, 'mario');
  });
});
