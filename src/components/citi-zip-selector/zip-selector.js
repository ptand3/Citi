(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["zipSelector"] = factory();
	else
		root["zipSelector"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var rng = __webpack_require__(2);
var bytesToUuid = __webpack_require__(3);

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

var _nodeId;
var _clockseq;

// Previous uuid creation time
var _lastMSecs = 0;
var _lastNSecs = 0;

// See https://github.com/broofa/node-uuid for API details
function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || [];

  options = options || {};
  var node = options.node || _nodeId;
  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq;

  // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189
  if (node == null || clockseq == null) {
    var seedBytes = rng();
    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [
        seedBytes[0] | 0x01,
        seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]
      ];
    }
    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  }

  // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime();

  // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock
  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1;

  // Time since last uuid creation (in msecs)
  var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs)/10000;

  // Per 4.2.1.2, Bump clockseq on clock regression
  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  }

  // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval
  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  }

  // Per 4.2.1.2 Throw error if too many uuids are requested
  if (nsecs >= 10000) {
    throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq;

  // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
  msecs += 12219292800000;

  // `time_low`
  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff;

  // `time_mid`
  var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff;

  // `time_high_and_version`
  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
  b[i++] = tmh >>> 16 & 0xff;

  // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
  b[i++] = clockseq >>> 8 | 0x80;

  // `clock_seq_low`
  b[i++] = clockseq & 0xff;

  // `node`
  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf ? buf : bytesToUuid(b);
}

module.exports = v1;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 2 */
/***/ (function(module, exports) {

// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection

// getRandomValues needs to be invoked in a context where "this" is a Crypto
// implementation. Also, find the complete implementation of crypto on IE11.
var getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) ||
                      (typeof(msCrypto) != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto));

if (getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

  module.exports = function whatwgRNG() {
    getRandomValues(rnds8);
    return rnds8;
  };
} else {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);

  module.exports = function mathRNG() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}


/***/ }),
/* 3 */
/***/ (function(module, exports) {

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
  return ([bth[buf[i++]], bth[buf[i++]], 
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]]]).join('');
}

module.exports = bytesToUuid;


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./src/scss/zip-selector.scss
var zip_selector = __webpack_require__(1);

// CONCATENATED MODULE: ./src/js/dialog.js
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

///////////////////////////////////////
// Dialog Object (Modal)
///////////////////////////////////////
var Dialog =
/*#__PURE__*/
function () {
  function Dialog(dialogNode) {
    _classCallCheck(this, Dialog);

    this.dialogNode = dialogNode;
    this.titleNode = this.dialogNode.querySelector('.dialog-title');
    this.subTitleNode = this.dialogNode.querySelector('.dialog-subtitle');
    this.closeNode = this.dialogNode.querySelector('.close-dialog');
    this.iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
    this.lastFocusNode;
    this.windowScroll = {
      x: 0,
      y: 0
    };
    this.keysMap = Object.freeze({
      'tab': 9,
      'escape': 27
    });
    this.dialogNode.setAttribute("tabindex", "-1"); // Need this line to grab all keydown events when no focusable element is on focus

    this.bindTriggerNodes();
    this.dialogNode.addEventListener('keydown', this.handleKeyDown.bind(this));
    this.dialogNode.addEventListener('click', this.handleClick.bind(this));
  }

  _createClass(Dialog, [{
    key: "bindTriggerNodes",
    value: function bindTriggerNodes(triggerNodes) {
      var _this = this;

      if (!triggerNodes) {
        triggerNodes = this.dialogNode.getAttribute('data-trig-class') ? document.querySelectorAll(".".concat(this.dialogNode.getAttribute('data-trig-class'))) : [];
      }

      if (triggerNodes instanceof Node) {
        // if just one node was passed to be binded, convert it to an array to be processed by the for loop
        triggerNodes = new Array(triggerNodes);
      }

      _toConsumableArray(triggerNodes).forEach(function (node) {
        // triggerNodes could be an array or a NodeList		
        if (node.getAttribute("data-dialog-binded") !== "true") {
          //Avoid binding more than one dialog to the same trigger
          node.addEventListener('click', _this.handleClick_triggerNodes.bind(_this));
          node.setAttribute("data-dialog-binded", "true");
        }
      });
    }
  }, {
    key: "handleClick_triggerNodes",
    value: function handleClick_triggerNodes(event) {
      event.preventDefault();
      this.openDialog(event.currentTarget);
    }
  }, {
    key: "openDialog",
    value: function openDialog(node) {
      this.lastFocusNode = node;

      if (!this.iOS) {
        document.querySelector('html').classList.add('dialog-no-scrolling');
        document.querySelector('body').classList.add('dialog-no-scrolling');
      } else {
        this.windowScroll.x = window.pageXOffset;
        this.windowScroll.y = window.pageYOffset;
        document.querySelector('html').classList.add('dialog-no-scrolling-iOS');
        document.querySelector('body').classList.add('dialog-no-scrolling-iOS');
        document.querySelector('body').style.top = '-' + this.windowScroll.y + 'px';
      }

      this.showNode(this.dialogNode);

      if (this.titleNode) {
        this.titleNode.setAttribute('tabindex', '0');
        this.titleNode.focus();
        this.titleNode.addEventListener("blur", removeTabindex);
      }

      function removeTabindex(event) {
        event.target.removeAttribute("tabindex");
        event.target.removeEventListener("blur", removeTabindex);
      }
    }
  }, {
    key: "handleClick",
    value: function handleClick(event) {
      switch (true) {
        case event.target === this.closeNode:
          this.closeDialog();
          break;
        // case (event.target === this.dialogNode): // Comented out bc of ADA stuff (don't close the dialog on click outside)
        // 	this.closeDialog();
        // 	break;
      }
    }
  }, {
    key: "handleKeyDown",
    value: function handleKeyDown(event) {
      var keyCode = event.keyCode || event.which;
      var tabbableNodes;

      switch (true) {
        case keyCode === this.keysMap.escape:
          //Escape
          this.closeDialog();
          break;

        case keyCode === this.keysMap.tab && event.shiftKey:
          //Shift + Tab
          tabbableNodes = this.getTabbableNodes();

          if (event.target === tabbableNodes[0]) {
            // if the focus is in the first element	
            event.preventDefault();
            tabbableNodes[tabbableNodes.length - 1].focus();
          } else if (event.target === this.titleNode) {
            // if the focus is in the modal title
            event.preventDefault();
            tabbableNodes[tabbableNodes.length - 1].focus();
          }

          break;

        case keyCode === this.keysMap.tab && !event.shiftKey:
          //Tab
          tabbableNodes = this.getTabbableNodes();

          if (event.target === tabbableNodes[tabbableNodes.length - 1]) {
            // if the focus is in the last element
            event.preventDefault();
            tabbableNodes[0].focus();
          }

          break;
      }
    }
  }, {
    key: "closeDialog",
    value: function closeDialog() {
      if (!this.iOS) {
        document.querySelector('html').classList.remove('dialog-no-scrolling');
        document.querySelector('body').classList.remove('dialog-no-scrolling');
      } else {
        document.querySelector('html').classList.remove('dialog-no-scrolling-iOS');
        document.querySelector('body').classList.remove('dialog-no-scrolling-iOS');
        document.querySelector('body').style.top = '';
        window.scrollTo(this.windowScroll.y, this.windowScroll.y);
      }

      this.hideNode(this.dialogNode); // If lastFocusNode node exist, place the focus on it

      if (this.lastFocusNode) {
        this.lastFocusNode.focus();
      }
    }
  }, {
    key: "getTabbableNodes",
    value: function getTabbableNodes() {
      var allPosibleNodes = Array.prototype.slice.call(this.dialogNode.querySelectorAll('select:not([disabled]), input:not([disabled]), textarea:not([disabled]), button:not([disabled]), a[href], area[href], iframe, object, embed, *[tabindex="0"], *[tabindex="1"], *[tabindex="2"], *[tabindex="3"], *[tabindex="4"], *[contenteditable]'));
      var tabbableNodes = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = allPosibleNodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var node = _step.value;

          if (node.offsetHeight && node.offsetWidth) {
            tabbableNodes.push(node);
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return tabbableNodes;
    }
  }, {
    key: "showNode",
    value: function showNode(node) {
      node.style.display = '';
    }
  }, {
    key: "hideNode",
    value: function hideNode(node) {
      node.style.display = "none";
    }
  }]);

  return Dialog;
}();

/* harmony default export */ var dialog = (Dialog);
// CONCATENATED MODULE: ./src/js/methods.js
function methods_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function methods_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function methods_createClass(Constructor, protoProps, staticProps) { if (protoProps) methods_defineProperties(Constructor.prototype, protoProps); if (staticProps) methods_defineProperties(Constructor, staticProps); return Constructor; }

var Methods =
/*#__PURE__*/
function () {
  function Methods() {
    methods_classCallCheck(this, Methods);
  }

  methods_createClass(Methods, [{
    key: "nameFormat",
    value: function nameFormat(value) {
      value = value.trim().replace(/\s+/g, ' '); //Remove extra spaces (at the beginning, at the end, and interword duplicate spaces )

      return /^[A-Za-z ]+$/.test(value);
    }
  }, {
    key: "digits",
    value: function digits(value) {
      return /^\d+$/.test(value);
    }
  }, {
    key: "decimal",
    value: function decimal(value) {
      return /^\d*\.?\d*$/.test(value);
    }
  }, {
    key: "phoneUS",
    value: function phoneUS(value) {
      value = value.replace(/\s+/g, '');
      return value.length > 9 && /^(\+?1-?)?(\([2-9]([02-9]\d|1[02-9])\)|[2-9]([02-9]\d|1[02-9]))-?[2-9]([02-9]\d|1[02-9])-?\d{4}$/.test(value);
    }
  }, {
    key: "zipUS",
    value: function zipUS(value) {
      return /^\d{5}(-\d{4})?$/.test(value);
    }
  }, {
    key: "email",
    value: function email(value) {
      // And between the Stack Overflow and the RFC approaches.
      return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value) && !/\.{2,}/.test(value) && /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(value); // Stack Overflow
      // return (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value) && !/\.{2,}/.test(value));
      // RFC
      // return /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(value);
      // w3school
      // return /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/.test(value);
    }
  }, {
    key: "addMethod",
    value: function addMethod(name, func) {
      // To add methods to the validator from outside the class definition:
      // import { validator } from '../xxx'
      // validator.addMethod("method_name", function (value) {
      //     return (true or false based on the value);
      // });
      Object.getPrototypeOf(this)[name] = func;
    }
  }]);

  return Methods;
}();

var validator = new Methods();
/* harmony default export */ var methods = (Methods);
// CONCATENATED MODULE: ./src/js/text_input.js
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function text_input_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function text_input_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function text_input_createClass(Constructor, protoProps, staticProps) { if (protoProps) text_input_defineProperties(Constructor.prototype, protoProps); if (staticProps) text_input_defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }



var uuidv1 = __webpack_require__(0);

var TextInput =
/*#__PURE__*/
function (_Methods) {
  _inherits(TextInput, _Methods);

  function TextInput(params) {
    var _this;

    text_input_classCallCheck(this, TextInput);

    // params variable looks like this
    // params = {
    //     node: node,
    //     rules: {
    //         required: true,
    //         nameFormat: true
    //     },
    //     messages: {
    //         required: "Please enter...",
    //         nameFormat: "Please enter a valid..."
    //     }
    // }
    _this = _possibleConstructorReturn(this, _getPrototypeOf(TextInput).call(this));
    _this.inputNode = params.node || params; //The second case will be executed in case the field is initialized with just the node

    _this.rules = params.rules || {};
    _this.messages = params.messages || {};
    _this.hasToValidate = !!Object.keys(_this.rules).length;
    _this.initialValue = _this.inputNode.value;
    _this.val = _this.inputNode.value; //Create the error message node

    if (_this.hasToValidate) {
      //Only create the error span if there is validation
      _this.errorUUID = uuidv1();
      _this.errorNode = document.createElement("span");
      _this.errorNode.id = _this.errorUUID;

      _this.errorNode.classList.add("error");

      _this.hideNode(_this.errorNode);

      _this.errorNode.setAttribute("aria-hidden", "true");

      _this.insertAfter(_this.errorNode, _this.inputNode);
    }

    _this.masking = _this.inputNode.getAttribute("data-mask");
    _this.inputPattern = _this.inputNode.getAttribute("data-allowed-pattern") ? new RegExp("^".concat(_this.inputNode.getAttribute("data-allowed-pattern"), "*$")) : false; // "dirty" when the fiels has been modified
    // "touched" when the field has lost focus after "dirty" status

    _this.status = "initial"; // Initially is undefined
    // After validation will be true or false

    _this.valid; //Events binding

    _this.inputNode.addEventListener('focus', _this.handleFocusIn.bind(_assertThisInitialized(_this)));

    _this.inputNode.addEventListener('input', _this.handleInput.bind(_assertThisInitialized(_this)));

    _this.inputNode.addEventListener('blur', _this.handleBlur.bind(_assertThisInitialized(_this))); //Avoid Firefox validation based on the pattern attribute


    var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

    if (isFirefox) {
      _this.inputNode.removeAttribute('pattern');
    }

    return _this;
  }

  text_input_createClass(TextInput, [{
    key: "focus",
    value: function focus() {
      this.inputNode.focus();
    }
  }, {
    key: "handleFocusIn",
    value: function handleFocusIn(event) {
      if (this.masking) {
        var self = this;
        setTimeout(function () {
          // The setTimout(0) is to allow the main thread to place the caret before getting its position
          var caretPosition = self.inputNode.selectionStart;
          self.inputNode.value = self.val;

          if (caretPosition !== undefined && caretPosition !== null) {
            self.inputNode.setSelectionRange(caretPosition, caretPosition);
          }
        }, 0);
      }
    }
  }, {
    key: "handleInput",
    value: function handleInput(event, val) {
      //val will be recievied from child class
      if (this.status === "initial") {
        this.status = "dirty";
      }

      if (this.inputPattern) {
        // Only make the validation if a value was entered
        if (this.val.length < this.inputNode.value.length) {
          if (this.inputPattern.test(this.inputNode.value)) {
            // Valid character
            this.val = this.inputNode.value;
          } else {
            // Invalid character
            var caretPosition = this.inputNode.selectionStart;

            if (caretPosition !== undefined && caretPosition !== null) {
              this.inputNode.value = this.val;
              this.inputNode.setSelectionRange(caretPosition - 1, caretPosition - 1);
            }
          }
        } else {
          this.val = this.inputNode.value;
        }
      }

      this.val = val || this.inputNode.value;

      if (this.status === "touched" && this.hasToValidate) {
        var ans = this.validate();

        if (ans.valid) {
          this.markValid();
        } else {
          this.markInvalid(ans.errorMsg);
        }
      }

      if (this.masking && document.activeElement !== this.inputNode) {
        var self = this;
        setTimeout(function () {
          //the timeout is to give time to the main thread finish writing the values in the fields
          self.mask();
        }, 0);
      }
    }
  }, {
    key: "handleBlur",
    value: function handleBlur(event) {
      if (this.status === "dirty") {
        this.status = "touched";
      }

      if (this.status !== "initial" && this.hasToValidate) {
        var ans = this.validate();

        if (ans.valid) {
          this.markValid();
        } else {
          this.markInvalid(ans.errorMsg);
        }
      }

      if (this.masking) {
        this.mask();
      }
    }
  }, {
    key: "validate",
    value: function validate(value) {
      var newVal = value || this.val;

      for (var rule in this.rules) {
        if (this.rules.hasOwnProperty(rule)) {
          switch (true) {
            case rule === "required" && (this.rules[rule] === true || this.rules[rule] === "true"):
              if (!newVal) {
                return {
                  valid: false,
                  errorMsg: this.messages[rule]
                };
              }

              break;

            case rule === "minLength":
              if (newVal.length < parseInt(this.rules[rule])) {
                return {
                  valid: false,
                  errorMsg: this.messages[rule]
                };
              }

              break;

            case rule === "minValue":
              if (parseFloat(newVal) < parseFloat(this.rules[rule])) {
                return {
                  valid: false,
                  errorMsg: this.messages[rule]
                };
              }

              break;

            case rule === "maxValue":
              if (parseFloat(newVal) > parseFloat(this.rules[rule])) {
                return {
                  valid: false,
                  errorMsg: this.messages[rule]
                };
              }

              break;

            default:
              if (this.rules[rule] === true || this.rules[rule] === "true") {
                if (this[rule] && !this[rule](newVal)) {
                  return {
                    valid: false,
                    errorMsg: this.messages[rule]
                  };
                }
              }

              break;
          }
        }
      }

      return {
        valid: true
      };
    }
  }, {
    key: "mask",
    value: function mask() {
      switch (this.masking.toLowerCase()) {
        case "full":
          {
            var len = this.val.length;
            var bullets = "•".repeat(len); //Check on IE

            this.inputNode.value = bullets;
          }
          break;

        case "view4":
          {
            var _len = this.val.length;

            if (_len > 4) {
              var _bullets = "•".repeat(_len - 4); //Check on IE


              this.inputNode.value = _bullets + this.val.substring(_len - 4);
            }
          }
          break;

        case "email":
          {
            var email = this.val;
            var name = email.substring(0, email.lastIndexOf("@"));
            var domain = email.substring(email.lastIndexOf("@"));
            var _len2 = name.length;

            switch (_len2) {
              case 0:
              case 1:
                break;

              case 2:
                this.inputNode.value = email[0] + "•" + domain;
                break;

              case 3:
                this.inputNode.value = email[0] + "••" + domain;
                break;

              default:
                var _bullets2 = "•".repeat(_len2 - 2); //Don't work in IE


                this.inputNode.value = email[0] + _bullets2 + email[_len2 - 1] + domain;
                break;
            }
          }
          break;
      }
    }
  }, {
    key: "unmask",
    value: function unmask() {
      this.inputNode.value = this.val;
    }
  }, {
    key: "reset",
    value: function reset() {
      this.val = this.initialValue;
      this.inputNode.value = this.initialValue;
      this.inputNode.removeAttribute("aria-invalid");
      this.inputNode.classList.remove("invalid");
      this.inputNode.classList.remove("valid");
      this.hideNode(this.errorNode);
      this.status = "initial";
      this.valid = undefined;
    }
  }, {
    key: "markInvalid",
    value: function markInvalid(errorMsg) {
      this.inputNode.setAttribute("aria-describedby", this.errorUUID);
      this.inputNode.setAttribute("aria-invalid", "true");
      this.inputNode.classList.remove("valid");
      this.inputNode.classList.add("invalid");
      this.errorNode.innerHTML = errorMsg;
      this.showNode(this.errorNode);
      this.valid = false;
      this.status = "touched"; //in case external validation is ordered by the Form object
    }
  }, {
    key: "markValid",
    value: function markValid() {
      this.inputNode.removeAttribute("aria-describedby");
      this.inputNode.setAttribute("aria-invalid", "false");
      this.inputNode.classList.remove("invalid");
      this.inputNode.classList.add("valid");
      this.hideNode(this.errorNode);
      this.errorNode.innerHTML = "";
      this.valid = true;
    }
  }, {
    key: "insertAfter",
    value: function insertAfter(newNode, referenceNode) {
      referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
  }, {
    key: "showNode",
    value: function showNode(node) {
      node.style.display = '';
    }
  }, {
    key: "hideNode",
    value: function hideNode(node) {
      node.style.display = "none";
    }
  }, {
    key: "value",
    get: function get() {
      return this.val;
    },
    set: function set(value) {
      if (this.validate(value).valid) {
        this.val = value;
        this.inputNode.value = value;
      }
    }
  }, {
    key: "isValid",
    get: function get() {
      return this.valid;
    }
  }, {
    key: "name",
    get: function get() {
      return this.inputNode.name;
    }
  }]);

  return TextInput;
}(methods);

/* harmony default export */ var text_input = (TextInput);
// CONCATENATED MODULE: ./src/js/form.js
function form_toConsumableArray(arr) { return form_arrayWithoutHoles(arr) || form_iterableToArray(arr) || form_nonIterableSpread(); }

function form_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function form_iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function form_arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function form_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function form_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function form_createClass(Constructor, protoProps, staticProps) { if (protoProps) form_defineProperties(Constructor.prototype, protoProps); if (staticProps) form_defineProperties(Constructor, staticProps); return Constructor; }



var form_Form =
/*#__PURE__*/
function () {
  function Form(params) {
    form_classCallCheck(this, Form);

    this.formNode = params.node;
    this.submitHandler = params.submitHandler;
    this.submitNode = this.formNode.querySelector("*[type=submit]");
    this.inputNodes = form_toConsumableArray(this.formNode.querySelectorAll("input")).map(function (input) {
      var supportedTypes = ["text", "number", "password", "email", "tel", "time", "date", "datetime-local", "month", "week", "file", "url"];

      if (supportedTypes.includes(input.type) && params[input.name]) {
        var inputParams = params[input.name];
        inputParams.node = input;
        return new text_input(inputParams);
      } else {
        return false;
      }
    }).filter(function (node) {
      return node;
    }); // this.formNode.addEventListener('submit', this.handleSubmit.bind(this));

    this.submitNode.addEventListener('click', this.handleSubmit.bind(this));
    this.formNode.addEventListener('reset', this.handleReset.bind(this));
  }

  form_createClass(Form, [{
    key: "handleSubmit",
    value: function handleSubmit(event) {
      event.preventDefault();

      if (this.validate()) {
        this.inputNodes.forEach(function (inputNode) {
          inputNode.unmask();
        });

        if (this.submitHandler) {
          this.submitHandler(this.formNode);
        } else {
          this.formNode.submit();
        }
      } else {
        for (var i = 0; i < this.inputNodes.length; i++) {
          if (!this.inputNodes[i].isValid) {
            this.inputNodes[i].focus();
            break;
          }
        }
      }
    }
  }, {
    key: "handleReset",
    value: function handleReset() {
      this.inputNodes.forEach(function (inputNode) {
        inputNode.reset();
      });
    }
  }, {
    key: "validate",
    value: function validate() {
      var valid = true;
      this.inputNodes.forEach(function (inputNode) {
        var ans = inputNode.validate();

        if (!ans.valid) {
          inputNode.markInvalid(ans.errorMsg);
          valid = false;
        }
      });
      return valid;
    }
  }, {
    key: "setFieldValue",
    value: function setFieldValue(fieldName, newVal) {
      for (var i = 0; i < this.inputNodes.length; i++) {
        if (fieldName === this.inputNodes[i].name) {
          if (this.inputNodes[i].validate(newVal).valid) {
            this.inputNodes[i].value = newVal;
            return true;
          }

          break;
        }
      }

      return false;
    }
  }, {
    key: "getFieldValue",
    value: function getFieldValue(fieldName) {
      for (var i = 0; i < this.inputNodes.length; i++) {
        if (fieldName === this.inputNodes[i].name) {
          return this.inputNodes[i].value;
        }
      }
    }
  }, {
    key: "getFieldObject",
    value: function getFieldObject(fieldName) {
      for (var i = 0; i < this.inputNodes.length; i++) {
        if (fieldName === this.inputNodes[i].name) {
          return this.inputNodes[i];
        }
      }
    }
  }]);

  return Form;
}();

/* harmony default export */ var js_form = (form_Form);
// CONCATENATED MODULE: ./src/js/utils.js
function utils_toConsumableArray(arr) { return utils_arrayWithoutHoles(arr) || utils_iterableToArray(arr) || utils_nonIterableSpread(); }

function utils_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function utils_iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function utils_arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

//////////////////////////////////////////
// Delay
//////////////////////////////////////////
var delay = function delay(ms) {
  return new Promise(function (_) {
    return setTimeout(_, ms);
  });
}; //////////////////////////////////////////
// Get offset relative to the document
//////////////////////////////////////////


function getOffsetTop(elem) {
  var offsetTop = 0;

  do {
    if (!isNaN(elem.offsetTop)) {
      offsetTop += elem.offsetTop;
    }
  } while (elem = elem.offsetParent);

  return offsetTop;
} ///////////////////////////////////////
// Get URL Parameter
///////////////////////////////////////


function getUrlParameter(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", 'i'),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
} ///////////////////////////////////////
// ADD/Replace URL Parameter
///////////////////////////////////////


function setUrlParam(param, url, newval) {
  // Replace a query string parameter with new value. If it doesn't exist, then it is added. 
  // param: name of the parameter (case INsensitive)
  // url: full URL or the query string section
  // newval: new value
  // examples: setUrlParam("GS", "http://www.google.com",       "FL") will return http://www.google.com?GS=FL
  //           setUrlParam("GS", "http://www.google.com?GS=AL", "FL") will return http://www.google.com?GS=FL
  url = deleteUrlParam(param, url);
  return url + (url.indexOf("?") !== -1 ? "&" : "?") + (newval ? param + "=" + newval : '');
} ///////////////////////////////////////
// Delete URL Parameter
///////////////////////////////////////


function deleteUrlParam(param, url) {
  // Delete a query string parameter. 
  // param: name of the parameter (case INsensitive)
  // url: full URL or the query string section
  // example: deleteUrlParam("GS", "http://www.google.com?GS=AL") will return http://www.google.com
  var regex = new RegExp("([?&])" + param + "=[^&]*&?", 'i');
  return url.replace(regex, "$1").replace(/[?&]$/, '');
} ///////////////////////////////////////
// Insert Node before another Node
///////////////////////////////////////


function insertBefore(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode);
} ///////////////////////////////////////
// Insert Node after another Node
///////////////////////////////////////


function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
} ///////////////////////////////////////
// Remove Node from DOM
///////////////////////////////////////


function removeNode(node) {
  return node.parentNode.removeChild(node);
} ///////////////////////////////////////
// States
///////////////////////////////////////


var States = new Map([["AL", "Alabama"], ["AK", "Alaska"], ["AS", "American Samoa"], ["AZ", "Arizona"], ["AR", "Arkansas"], ["CA", "California"], ["CO", "Colorado"], ["CT", "Connecticut"], ["DE", "Delaware"], ["DC", "District Of Columbia"], ["FL", "Florida"], ["GA", "Georgia"], ["GU", "Guam"], ["HI", "Hawaii"], ["ID", "Idaho"], ["IL", "Illinois"], ["IN", "Indiana"], ["IA", "Iowa"], ["KS", "Kansas"], ["KY", "Kentucky"], ["LA", "Louisiana"], ["ME", "Maine"], ["MD", "Maryland"], ["MA", "Massachusetts"], ["MI", "Michigan"], ["AA", "Military Customers elsewhere in the Americas"], ["AE", "Military Customers in Africa, Canada, Europe or Middle East"], ["AP", "Military Customers in the Pacific"], ["MN", "Minnesota"], ["MS", "Mississippi"], ["MO", "Missouri"], ["MT", "Montana"], ["NE", "Nebraska"], ["NV", "Nevada"], ["NH", "New Hampshire"], ["NJ", "New Jersey"], ["NM", "New Mexico"], ["NY", "New York"], ["NC", "North Carolina"], ["ND", "North Dakota"], ["MP", "Northern Mariana Islands"], ["OH", "Ohio"], ["OK", "Oklahoma"], ["OR", "Oregon"], ["PA", "Pennsylvania"], ["PR", "Puerto Rico"], ["RI", "Rhode Island"], ["SC", "South Carolina"], ["SD", "South Dakota"], ["TN", "Tennessee"], ["TX", "Texas"], ["UT", "Utah"], ["VT", "Vermont"], ["VI", "Virgin Islands"], ["VA", "Virginia"], ["WA", "Washington"], ["WV", "West Virginia"], ["WI", "Wisconsin"], ["WY", "Wyoming"]]); ///////////////////////////////////////
// ADA States Acronym conversion
///////////////////////////////////////

function stateAcronymConversion(node) {
  var text = node.innerHTML;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = States[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _step$value = _slicedToArray(_step.value, 2),
          key = _step$value[0],
          state = _step$value[1];

      var re = new RegExp("( |^)(".concat(key, ")([,. ]|$)"), 'g'); //find and remember $1: space or starting line, $2: acronym letters, $3: comma, period or end of line

      text = text.replace(re, "$1<span class=\"visuallyhidden\">".concat(state, "</span><span aria-hidden=\"true\">$2</span>$3"));
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  node.innerHTML = text;
} ///////////////////////////////////////
// Describedby target="_blank" Links
///////////////////////////////////////


function describeTargetLinks(nodes) {
  if (!nodes) {
    nodes = document.querySelectorAll('a[target="_blank"]');
  }

  if (nodes instanceof Node) {
    // if just one node was passed to be binded, convert it to an array to be processed by the for loop
    nodes = new Array(nodes);
  }

  utils_toConsumableArray(nodes).forEach(function (node) {
    if (node.hasAttribute("aria-describedby")) {
      var currentAttributes = node.getAttribute("aria-describedby").split(' ');

      if (!currentAttributes.includes("a11y-message--new-window")) {
        currentAttributes.push("a11y-message--new-window");
      }

      node.setAttribute("aria-describedby", currentAttributes.join(' ').trim());
    } else {
      node.setAttribute("aria-describedby", "a11y-message--new-window");
    }
  });
}


// CONCATENATED MODULE: ./src/js/zip-selector.js
function zip_selector_typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { zip_selector_typeof = function _typeof(obj) { return typeof obj; }; } else { zip_selector_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return zip_selector_typeof(obj); }

function zip_selector_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function zip_selector_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function zip_selector_createClass(Constructor, protoProps, staticProps) { if (protoProps) zip_selector_defineProperties(Constructor.prototype, protoProps); if (staticProps) zip_selector_defineProperties(Constructor, staticProps); return Constructor; }

function zip_selector_possibleConstructorReturn(self, call) { if (call && (zip_selector_typeof(call) === "object" || typeof call === "function")) { return call; } return zip_selector_assertThisInitialized(self); }

function zip_selector_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = zip_selector_getPrototypeOf(object); if (object === null) break; } return object; }

function zip_selector_getPrototypeOf(o) { zip_selector_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return zip_selector_getPrototypeOf(o); }

function zip_selector_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) zip_selector_setPrototypeOf(subClass, superClass); }

function zip_selector_setPrototypeOf(o, p) { zip_selector_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return zip_selector_setPrototypeOf(o, p); }




var zip_selector_uuidv1 = __webpack_require__(0);




var falseZipsList = [];
validator.addMethod("bogusZips", function (value) {
  return !falseZipsList.includes(value);
}); ///////////////////////////////////////
// ZIP Selector Object (Modal)
///////////////////////////////////////

var zip_selector_ZipSelector =
/*#__PURE__*/
function (_Dialog) {
  zip_selector_inherits(ZipSelector, _Dialog);

  function ZipSelector(params) {
    var _this;

    zip_selector_classCallCheck(this, ZipSelector);

    // params variable looks like this
    // {
    //     node: node,
    //     pageType: "IN"/"OUT",
    //     zip: 33133,
    //     getZipData: getZipData,  //external method that returns a Promise that resolve into the ZIP data
    //     callback: callbackFunction
    // }
    _this = zip_selector_possibleConstructorReturn(this, zip_selector_getPrototypeOf(ZipSelector).call(this, params.node));
    _this.pageType = params.pageType;
    _this.callback = params.callback;
    _this.getZipData = params.getZipData;
    _this.initialContNode = _this.dialogNode.querySelector(".container.initial");
    _this.titleNode = _this.initialContNode.querySelector(".zs-title");
    _this.subtitleNode = _this.initialContNode.querySelector(".zs-subtitle");
    _this.notValidContNode = _this.dialogNode.querySelector(".container.unavailable");
    _this.titleErrorNode = _this.notValidContNode.querySelector(".zs-title-unavailable");
    _this.subtitleErrorNode = _this.notValidContNode.querySelector(".zs-subtitle-unavailable");
    _this.learnMoreNode = _this.notValidContNode.querySelector(".learn-more");
    _this.formNode = _this.dialogNode.querySelector("form.zip-form");
    _this.zipLabelNode = _this.formNode.querySelector(".zip-label");
    _this.zipInputNode = _this.formNode.querySelector('input[name="zip"]');
    _this.cancelable; // Boolean. Indicates if the zip is mandatory or not and could be canceled/closed

    _this.cancelLinkNode = _this.formNode.querySelector("a.cancel"); // Link to another page

    _this.cancelButtonNode = _this.formNode.querySelector("button.cancel"); // Closes the modal

    if (_this.titleNode) {
      var titleId = zip_selector_uuidv1();

      _this.titleNode.setAttribute("id", titleId);

      _this.dialogNode.setAttribute("aria-labelledby", titleId);
    }

    if (_this.subtitleNode) {
      var subtitleId = zip_selector_uuidv1();

      _this.subtitleNode.setAttribute("id", subtitleId);

      _this.dialogNode.setAttribute("aria-describedby", subtitleId);
    }

    if (_this.zipLabelNode && _this.zipInputNode) {
      var zipId = zip_selector_uuidv1();

      _this.zipLabelNode.setAttribute("for", zipId);

      _this.zipInputNode.setAttribute("id", zipId);
    }

    var self = zip_selector_assertThisInitialized(_this); // To use this inside the submitHandler function


    var lastZip; //keep track of the last successful displayed ZIP code data

    var formObj = new js_form({
      node: _this.formNode,
      submitHandler: function submitHandler(formNode) {
        var _this2 = this;

        var zipNode = formNode.zip;
        var zipValue = zipNode.value;

        if (zipValue !== lastZip) {
          // Only hit the API/DB if the requested ZIP is not the one being displayed
          self.getZipData(zipValue).then(function (data) {
            data.zip = data.zip.padStart(5, '0'); // just in case the DB returns lees than five digits (501 -> 00501)

            if (data.zip !== zipValue || zipValue === "00000") {
              //
              throw Error("INVALID ZIP");
            }

            if (!self.pageType || data.bta === self.pageType) {
              ///////////////////////////
              // Close Modal, Show Page
              ///////////////////////////
              self.closeDialog();
              self.callback(data);
            } else {
              ///////////////////////////
              // Show Not Available
              ///////////////////////////
              self.hideNode(self.initialContNode);
              self.showNode(self.notValidContNode); //Re-assign aria-labelledby & aria-describedby for the modal

              var _titleId = self.titleNode.getAttribute("id");

              self.titleNode.removeAttribute("id");
              self.titleErrorNode.setAttribute("id", _titleId);

              var _subtitleId = self.subtitleNode.getAttribute("id");

              self.subtitleNode.removeAttribute("id");
              self.subtitleErrorNode.setAttribute("id", _subtitleId);
              var learnMoreHref = self.learnMoreNode.getAttribute("href");
              learnMoreHref = setUrlParam("GS", learnMoreHref, data.gs);
              learnMoreHref = setUrlParam("zc", learnMoreHref, data.zip);
              self.learnMoreNode.setAttribute("href", learnMoreHref);
              zipNode.focus();
            }
          }).catch(function (error) {
            if (error.message === "INVALID ZIP") {
              falseZipsList.push(zipValue);

              var ans = _this2.getFieldObject("zip").validate();

              _this2.getFieldObject("zip").markInvalid(ans.errorMsg);

              zipNode.focus();
            } else {
              console.log(error.message);
            }
          });
        } else {
          zipNode.focus();
        }
      },
      zip: {
        rules: {
          required: true,
          zipUS: true,
          bogusZips: true
        },
        messages: {
          required: "Please enter your ZIP code",
          zipUS: "Please enter a valid ZIP code",
          bogusZips: "Please enter a valid ZIP code"
        }
      }
    }); // Pre-populate the ZIP input field. and add the place holder (added here to avoid flicker in case a good ZIP is detected server side)

    formObj.setFieldValue("zip", params.zip);

    _this.zipInputNode.setAttribute("placeholder", "Enter 5-Digit ZIP code");

    return _this;
  }

  zip_selector_createClass(ZipSelector, [{
    key: "handleClick_triggerNodes",
    value: function handleClick_triggerNodes(event) {
      event.preventDefault();
      this.openDialog(event.currentTarget, "cancelable");
    }
  }, {
    key: "openDialog",
    value: function openDialog(node, mode) {
      this.hideNode(this.notValidContNode);
      this.showNode(this.initialContNode);

      if (mode === "cancelable") {
        this.cancelable = true;
        this.hideNode(this.cancelLinkNode);
        this.showNode(this.cancelButtonNode);
        this.showNode(this.closeNode);
      } else {
        this.cancelable = false;
        this.showNode(this.cancelLinkNode);
        this.hideNode(this.cancelButtonNode);
        this.hideNode(this.closeNode);
      }

      _get(zip_selector_getPrototypeOf(ZipSelector.prototype), "openDialog", this).call(this, node);
    }
  }, {
    key: "handleClick",
    value: function handleClick(event) {
      switch (true) {
        case event.target === this.cancelButtonNode:
          this.closeDialog();
          break;

        default:
          _get(zip_selector_getPrototypeOf(ZipSelector.prototype), "handleClick", this).call(this, event);

          break;
      }
    }
  }, {
    key: "handleKeyDown",
    value: function handleKeyDown(event) {
      var keyCode = event.keyCode || event.which;

      switch (true) {
        case !this.cancelable && keyCode === this.keysMap.escape:
          //Escape
          event.preventDefault();
          break;

        default:
          _get(zip_selector_getPrototypeOf(ZipSelector.prototype), "handleKeyDown", this).call(this, event);

          break;
      }
    }
  }]);

  return ZipSelector;
}(dialog);

/* harmony default export */ var js_zip_selector = __webpack_exports__["default"] = (zip_selector_ZipSelector);

/***/ })
/******/ ])["default"];
});