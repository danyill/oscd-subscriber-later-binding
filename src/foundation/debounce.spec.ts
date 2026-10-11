import { expect } from '@open-wc/testing';
import * as sinon from 'sinon';

import { debounce } from './debounce.js';

describe('debounce', () => {
  let clock: sinon.SinonFakeTimers;

  beforeEach(() => {
    clock = sinon.useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
  });

  it('does not call back before the delay has passed', () => {
    const callback = sinon.spy();
    debounce(callback, 100)();
    clock.tick(99);
    expect(callback.callCount).to.equal(0);
  });

  it('calls back once after the delay', () => {
    const callback = sinon.spy();
    debounce(callback, 100)();
    clock.tick(100);
    expect(callback.callCount).to.equal(1);
  });

  it('defaults to a 100 ms delay', () => {
    const callback = sinon.spy();
    debounce(callback)();
    clock.tick(99);
    expect(callback.callCount).to.equal(0);
    clock.tick(1);
    expect(callback.callCount).to.equal(1);
  });

  it('calls back once with the last arguments for a burst of calls', () => {
    const callback = sinon.spy();
    const debounced = debounce(callback, 100);
    debounced('a');
    clock.tick(50);
    debounced('b');
    clock.tick(50);
    debounced('c');
    clock.tick(100);
    expect(callback.callCount).to.equal(1);
    expect(callback.firstCall.args).to.deep.equal(['c']);
  });

  it('calls back again for calls separated by more than the delay', () => {
    const callback = sinon.spy();
    const debounced = debounce(callback, 100);
    debounced(1);
    clock.tick(100);
    debounced(2);
    clock.tick(100);
    expect(callback.args).to.deep.equal([[1], [2]]);
  });
});
