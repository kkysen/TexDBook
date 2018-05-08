/******/ (function(modules) { // webpackBootstrap
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/ts/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/ts/core/TexDBook.ts":
/*!*********************************!*\
  !*** ./src/ts/core/TexDBook.ts ***!
  \*********************************/
/*! exports provided: main */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"main\", function() { return main; });\nconst main = function () {\r\n    console.log(window._clone());\r\n};\r\n\n\n//# sourceURL=webpack:///./src/ts/core/TexDBook.ts?");

/***/ }),

/***/ "./src/ts/main.js":
/*!************************!*\
  !*** ./src/ts/main.js ***!
  \************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _util_extensions_allExtensions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util/extensions/allExtensions */ \"./src/ts/util/extensions/allExtensions.ts\");\n/* harmony import */ var _core_TexDBook__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./core/TexDBook */ \"./src/ts/core/TexDBook.ts\");\n\r\n\r\nObject(_util_extensions_allExtensions__WEBPACK_IMPORTED_MODULE_0__[\"addExtensions\"])();\r\nObject(_core_TexDBook__WEBPACK_IMPORTED_MODULE_1__[\"main\"])();\r\n//# sourceMappingURL=main.js.map\n\n//# sourceURL=webpack:///./src/ts/main.js?");

/***/ }),

/***/ "./src/ts/util/extensions/allExtensions.ts":
/*!*************************************************!*\
  !*** ./src/ts/util/extensions/allExtensions.ts ***!
  \*************************************************/
/*! exports provided: addExtensions */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"addExtensions\", function() { return addExtensions; });\nconst immutableDescriptor = {\r\n    writable: false,\r\n    enumerable: false,\r\n    configurable: false,\r\n};\r\nconst defineSharedProperties = function (obj, sharedDescriptor, propertyValues) {\r\n    const properties = Object.getOwnPropertyDescriptors(propertyValues);\r\n    for (const propertyName in properties) {\r\n        if (properties.hasOwnProperty(propertyName)) {\r\n            let property = properties[propertyName];\r\n            property = Object.assign(property, sharedDescriptor);\r\n            if (property.get || property.set) {\r\n                delete property.writable;\r\n            }\r\n            properties[propertyName] = property;\r\n        }\r\n    }\r\n    Object.defineProperties(obj, properties);\r\n};\r\nconst defineImmutableProperties = function (obj, propertyValues) {\r\n    defineSharedProperties(obj, immutableDescriptor, propertyValues);\r\n};\r\nObject.defineProperties(Object, {\r\n    defineSharedProperties: {\r\n        writable: false,\r\n        enumerable: false,\r\n        configurable: false,\r\n        value: defineSharedProperties,\r\n    },\r\n    defineImmutableProperties: {\r\n        writable: false,\r\n        enumerable: false,\r\n        configurable: false,\r\n        value: defineImmutableProperties,\r\n    },\r\n});\r\nObject.defineImmutableProperties(Object, {\r\n    getting(key) {\r\n        return o => o[key];\r\n    },\r\n    deleting(key) {\r\n        return o => {\r\n            delete o[key];\r\n            return o;\r\n        };\r\n    },\r\n});\r\nObject.defineImmutableProperties(Object.prototype, {\r\n    freeze() {\r\n        return Object.freeze(this);\r\n    },\r\n    seal() {\r\n        return Object.seal(this);\r\n    },\r\n    _clone() {\r\n        return Object.assign({}, this);\r\n    },\r\n});\r\nObject.defineImmutableProperties(Function, {\r\n    compose(...funcs) {\r\n        const numFuncs = funcs.length;\r\n        if (numFuncs === 0) {\r\n            return () => undefined;\r\n        }\r\n        if (numFuncs === 1) {\r\n            return funcs[0];\r\n        }\r\n        return function (...args) {\r\n            let result = funcs[0](...args);\r\n            for (let i = 1; i < numFuncs; i++) {\r\n                result = funcs[i](result);\r\n            }\r\n            return result;\r\n        };\r\n    },\r\n});\r\nObject.defineImmutableProperties(Function.prototype, {\r\n    then(nextFunc) {\r\n        return (arg) => nextFunc(this(arg));\r\n    },\r\n    applyReturning() {\r\n        return (arg) => {\r\n            this(arg);\r\n            return arg;\r\n        };\r\n    },\r\n    mapping() {\r\n        return array => array.map(this);\r\n    },\r\n    applying() {\r\n        return array => this(...array);\r\n    },\r\n    timed() {\r\n        const timer = (...args) => {\r\n            console.time(this.name);\r\n            const returnValue = this(...args);\r\n            console.timeEnd(this.name);\r\n            return returnValue;\r\n        };\r\n        timer.name = \"timing_\" + this.name;\r\n        return timer;\r\n    },\r\n});\r\nObject.defineImmutableProperties(Array.prototype, {\r\n    clear() {\r\n        this.length = 0;\r\n    },\r\n    remove(value) {\r\n        const i = this.indexOf(value);\r\n        if (i !== -1) {\r\n            this.splice(i, 1);\r\n        }\r\n    },\r\n    applyOn(func) {\r\n        return func(this);\r\n    },\r\n    callOn(func) {\r\n        return func(...this);\r\n    },\r\n    toObject() {\r\n        let o = {};\r\n        for (const [k, v] of this) {\r\n            o[k] = v;\r\n        }\r\n        return o;\r\n    },\r\n    sortBy(key) {\r\n        this.sort((a, b) => key(a) - key(b));\r\n        return this;\r\n    },\r\n    random() {\r\n        return this[Math.floor(Math.random() * this.length)];\r\n    },\r\n});\r\nObject.defineImmutableProperties(Number, {\r\n    isNumber(n) {\r\n        return !Number.isNaN(n);\r\n    },\r\n    toPixels(n) {\r\n        return Math.round(n) + \"px\";\r\n    },\r\n});\r\nObject.defineImmutableProperties(Node.prototype, {\r\n    appendBefore(node) {\r\n        return this.parentNode.insertBefore(node, this);\r\n    },\r\n    appendAfter(node) {\r\n        return this.nextSibling.appendBefore(node);\r\n    },\r\n});\r\nObject.defineImmutableProperties(Element.prototype, {\r\n    clearHTML() {\r\n        this.innerHTML = \"\";\r\n    },\r\n    setAttributes(attributes) {\r\n        for (const attribute in attributes) {\r\n            if (attributes.hasOwnProperty(attribute) && attributes[attribute]) {\r\n                this.setAttribute(attribute, attributes[attribute].toString());\r\n            }\r\n        }\r\n    },\r\n});\r\nObject.defineImmutableProperties(HTMLElement.prototype, {\r\n    appendTo(parent) {\r\n        parent.appendChild(this);\r\n        return this;\r\n    },\r\n    appendNewElement(tagName) {\r\n        return this.appendChild(document.createElement(tagName));\r\n    },\r\n    appendDiv() {\r\n        return this.appendNewElement(\"div\");\r\n    },\r\n    appendButton(buttonText) {\r\n        const button = this.appendNewElement(\"button\");\r\n        button.innerText = buttonText;\r\n        return button;\r\n    },\r\n    appendBr() {\r\n        return this.appendNewElement(\"br\");\r\n    },\r\n    withInnerText(text) {\r\n        this.innerText = text;\r\n        return this;\r\n    },\r\n    withInnerHTML(html) {\r\n        this.innerHTML = html;\r\n        return this;\r\n    },\r\n});\r\nconst addExtensions = function () {\r\n};\r\n\n\n//# sourceURL=webpack:///./src/ts/util/extensions/allExtensions.ts?");

/***/ })

/******/ });