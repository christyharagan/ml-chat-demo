import {Observable, CompositeDisposable, IDisposable, Subject} from 'rx'

function choose(selector, eventName) {
  if (typeof this._interaction$[selector] === 'undefined') {
    this._interaction$[selector] = {};
  }
  if (typeof this._interaction$[selector][eventName] === 'undefined') {
    this._interaction$[selector][eventName] = new Rx.Subject();
  }
  return this._interaction$[selector][eventName];
}


function inputProxy() {
  let inputProxy = <any>new Subject()
  inputProxy.type = 'InputProxy';
  inputProxy._interaction$ = {};
  inputProxy.choose = choose
  return inputProxy
}

function throwIfNotObservable(thing) {
  if (typeof thing === 'undefined' || typeof thing.subscribe !== 'function') {
    throw new Error('Stream function should always return an Rx.Observable.');
  }
}

function replicate(source, subject) {
  return source.subscribe(subject.asObserver());
}

function replicateAllInteraction$(input, proxy) {
  let subscriptions = new CompositeDisposable();
  let selectors = proxy._interaction$;
  for (let selector in selectors) { if (selectors.hasOwnProperty(selector)) {
    let elemEvents = selectors[selector];
    for (let eventName in elemEvents) { if (elemEvents.hasOwnProperty(eventName)) {
      let event$ = input.choose(selector, eventName);
      if (event$ !== null) {
        let subscription = replicate(event$, elemEvents[eventName]);
        subscriptions.add(subscription);
      }
    }}
  }}
  return subscriptions;
}

function replicateAll(input, proxy) {
  if (!input || !proxy) { return; }

  if (typeof input.choose === 'function') {
    return replicateAllInteraction$(input, proxy);
  } else if (typeof input.subscribe === 'function' && proxy.type === 'InputProxy') {
    return replicate(input, proxy);
  } else {
    throw new Error('Cycle Stream got injected with invalid inputs.');
  }
}

function makeInjectFn(stream) {
  return function inject() {
    if (stream._wasInjected) {
      console.warn('Stream has already been injected an input.');
    }
    if (stream._definitionFn.length !== arguments.length) {
      console.warn('The call to inject() should provide the inputs that this ' +
      'Stream expects according to its definition function.');
    }
    for (let i = 0; i < stream._definitionFn.length; i++) {
      let subscription = replicateAll(arguments[i], stream._proxies[i]);
      stream._subscription.add(subscription);
    }
    stream._wasInjected = true;
    if (arguments.length === 1) {
      return arguments[0];
    } else if (arguments.length > 1) {
      return Array.prototype.slice.call(arguments);
    } else {
      return null;
    }
  };
}

function makeDisposeFn(stream) {
  return function dispose() {
    if (stream._subscription && typeof stream._subscription.dispose === 'function') {
      stream._subscription.dispose();
    }
  };
}

export interface Stream<T> extends Observable<T>, IDisposable {
  inject: (...dependencies:Observable<any>[])=>Stream<T>
}

export function createStream<T>(definitionFn:(...dependencies:Observable<any>[])=>Observable<T>):Stream<T> {
  if (arguments.length !== 1 || typeof definitionFn !== 'function') {
    throw new Error('Stream expects the definitionFn as the only argument.');
  }
  if (this instanceof createStream) { // jshint ignore:line
    throw new Error('Cannot use `new` on `createStream()`, it is not a constructor.');
  }

  let proxies = [];
  for (let i = 0; i < definitionFn.length; i++) {
    proxies[i] = inputProxy();
  }
  let stream = definitionFn.apply({}, proxies);
  throwIfNotObservable(stream);
  stream._proxies = proxies;
  stream._definitionFn = definitionFn;
  stream._wasInjected = false;
  stream._subscription = new CompositeDisposable();
  stream.inject = makeInjectFn(stream);
  stream.dispose = makeDisposeFn(stream);
  return stream;
}
