import 'mocha';
import {assert} from "chai";
import {mastermindService} from "../src/common/mastermindService";

describe('Tests', () => {

    let service;
    beforeEach(() => {
       service = new mastermindService("12343");
    });
    afterEach(() => {
    });
    it('first test', async () => {
        const result = service.checkWin("11133");
        assert.equal(result, "posizione(2) giusto(3)");
        assert.notEqual(result, "");
    });
    it('second test', async () => {
        const result = service.checkWin("12233");
        assert.equal(result, "posizione(3) giusto(4)");
        assert.notEqual(result, "");
    });
    it('third test', async () => {
        const result = service.checkWin("12333");
        assert.equal(result, "posizione(4) giusto(4)");
        assert.notEqual(result, "");
    });
    it('forth test', async () => {
        const result = service.checkWin("12343");
        assert.equal(result, "WIN");
        assert.notEqual(result, "");
    });
});