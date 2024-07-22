import { assert } from '@ember/debug';
import { action } from '@ember/object';
import { inject } from '@ember/service';
import { DEBUG } from '@glimmer/env';
import Modifier from 'ember-modifier';
import deepEqual from 'fast-deep-equal';
import { registerDestructor } from '@ember/destroyable';
import { macroCondition, dependencySatisfies } from '@embroider/macros';

function _applyDecoratedDescriptor(i, e, r, n, l) {
  var a = {};
  return Object.keys(n).forEach(function (i) {
    a[i] = n[i];
  }), a.enumerable = !!a.enumerable, a.configurable = !!a.configurable, ("value" in a || a.initializer) && (a.writable = !0), a = r.slice().reverse().reduce(function (r, n) {
    return n(i, e, r) || r;
  }, a), l && void 0 !== a.initializer && (a.value = a.initializer ? a.initializer.call(l) : void 0, a.initializer = void 0), void 0 === a.initializer ? (Object.defineProperty(i, e, a), null) : a;
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e;
}
function _initializerDefineProperty(e, i, r, l) {
  r && Object.defineProperty(e, i, {
    enumerable: r.enumerable,
    configurable: r.configurable,
    writable: r.writable,
    value: r.initializer ? r.initializer.call(l) : void 0
  });
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}

const WATCHED_ELEMENTS = DEBUG ? new WeakSet() : undefined;
let modifier;
if (macroCondition(dependencySatisfies('ember-modifier', '>=3.2.0 || 4.x'))) {
  var _class, _descriptor;
  modifier = (_class = class InViewportModifier extends Modifier {
    constructor(...args) {
      super(...args);
      _initializerDefineProperty(this, "inViewport", _descriptor, this);
      _defineProperty(this, "name", 'in-viewport');
      _defineProperty(this, "lastOptions", void 0);
      _defineProperty(this, "element", null);
    }
    modify(element, positional, named) {
      this.element = element;
      this.positional = positional;
      this.named = named;
      this.validateArguments();
      if (!this.didSetup) {
        this.setupWatcher(element);
        registerDestructor(() => this.destroyWatcher(element));
      } else if (this.hasStaleOptions) {
        this.destroyWatcher(element);
        this.setupWatcher(element);
      }
    }
    get options() {
      // eslint-disable-next-line no-unused-vars
      const {
        onEnter,
        onExit,
        ...options
      } = this.named;
      return options;
    }
    get hasStaleOptions() {
      return !deepEqual(this.options, this.lastOptions);
    }
    validateArguments() {
      assert(`'{{in-viewport}}' does not accept positional parameters. Specify listeners via 'onEnter' / 'onExit'.`, this.positional.length === 0);
      assert(`'{{in-viewport}}' either expects 'onEnter', 'onExit' or both to be present.`, typeof this.named.onEnter === 'function' || typeof this.named.onExit === 'function');
    }
    onEnter(...args) {
      if (this.named.onEnter) {
        this.named.onEnter.call(null, this.element, ...args);
      }
      if (!this.options.viewportSpy) {
        this.inViewport.stopWatching(this.element);
      }
    }
    onExit(...args) {
      if (this.named.onExit) {
        this.named.onExit.call(null, this.element, ...args);
      }
    }
    setupWatcher(element) {
      assert(`'${element}' is already being watched. Make sure that '{{in-viewport}}' is only used once on this element and that you are not calling 'inViewport.watchElement(element)' in other places.`, !WATCHED_ELEMENTS.has(element));
      if (DEBUG) WATCHED_ELEMENTS.add(element);
      this.inViewport.watchElement(element, this.options, this.onEnter, this.onExit);
      this.lastOptions = this.options;
    }
    destroyWatcher(element) {
      if (DEBUG) WATCHED_ELEMENTS.delete(element);
      this.inViewport.stopWatching(element);
    }
  }, (_descriptor = _applyDecoratedDescriptor(_class.prototype, "inViewport", [inject], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _applyDecoratedDescriptor(_class.prototype, "onEnter", [action], Object.getOwnPropertyDescriptor(_class.prototype, "onEnter"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "onExit", [action], Object.getOwnPropertyDescriptor(_class.prototype, "onExit"), _class.prototype)), _class);
} else {
  var _class2, _descriptor2;
  modifier = (_class2 = class InViewportModifier extends Modifier {
    constructor(...args) {
      super(...args);
      _initializerDefineProperty(this, "inViewport", _descriptor2, this);
      _defineProperty(this, "name", 'in-viewport');
      _defineProperty(this, "lastOptions", void 0);
    }
    get options() {
      // eslint-disable-next-line no-unused-vars
      const {
        onEnter,
        onExit,
        ...options
      } = this.args.named;
      return options;
    }
    get hasStaleOptions() {
      return !deepEqual(this.options, this.lastOptions);
    }
    validateArguments() {
      assert(`'{{in-viewport}}' does not accept positional parameters. Specify listeners via 'onEnter' / 'onExit'.`, this.args.positional.length === 0);
      assert(`'{{in-viewport}}' either expects 'onEnter', 'onExit' or both to be present.`, typeof this.args.named.onEnter === 'function' || typeof this.args.named.onExit === 'function');
    }
    onEnter(...args) {
      if (this.args.named.onEnter) {
        this.args.named.onEnter.call(null, this.element, ...args);
      }
      if (!this.options.viewportSpy) {
        this.inViewport.stopWatching(this.element);
      }
    }
    onExit(...args) {
      if (this.args.named.onExit) {
        this.args.named.onExit.call(null, this.element, ...args);
      }
    }
    setupWatcher() {
      assert(`'${this.element}' is already being watched. Make sure that '{{in-viewport}}' is only used once on this element and that you are not calling 'inViewport.watchElement(element)' in other places.`, !WATCHED_ELEMENTS.has(this.element));
      if (DEBUG) WATCHED_ELEMENTS.add(this.element);
      this.inViewport.watchElement(this.element, this.options, this.onEnter, this.onExit);
      this.lastOptions = this.options;
    }
    destroyWatcher() {
      if (DEBUG) WATCHED_ELEMENTS.delete(this.element);
      this.inViewport.stopWatching(this.element);
    }
    didInstall() {
      this.setupWatcher();
    }
    didUpdateArguments() {
      if (this.hasStaleOptions) {
        this.destroyWatcher();
        this.setupWatcher();
      }
    }
    didReceiveArguments() {
      this.validateArguments();
    }
    willRemove() {
      this.destroyWatcher();
    }
  }, (_descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "inViewport", [inject], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _applyDecoratedDescriptor(_class2.prototype, "onEnter", [action], Object.getOwnPropertyDescriptor(_class2.prototype, "onEnter"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "onExit", [action], Object.getOwnPropertyDescriptor(_class2.prototype, "onExit"), _class2.prototype)), _class2);
}
var modifier$1 = modifier;

export { modifier$1 as default };
//# sourceMappingURL=in-viewport.js.map
