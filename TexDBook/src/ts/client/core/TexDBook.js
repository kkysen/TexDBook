"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const anyWindow_1 = require("../util/anyWindow");
const plainTexDBook = anyWindow_1.anyWindow.TexDBook;
let { isLoggedIn } = plainTexDBook;
isLoggedIn.freeze();
const { csrfToken } = plainTexDBook;
let resolveOnLogin;
exports.onLogin = new Promise(resolve => {
    resolveOnLogin = resolve;
});
exports.TexDBook = {
    get onLogin() {
        return exports.onLogin;
    },
    get isLoggedIn() {
        return isLoggedIn;
    },
    set isLoggedIn(_isLoggedIn) {
        isLoggedIn = _isLoggedIn.freeze();
        if (isLoggedIn.isLoggedIn) {
            resolveOnLogin();
        }
    },
    get csrfToken() {
        return csrfToken;
    },
};
exports.TexDBook.isLoggedIn = isLoggedIn;
anyWindow_1.anyWindow.TexDBook = exports.TexDBook;
const Main_1 = require("./components/views/Main");
exports.main = function () {
    Main_1.reactMain();
};
//# sourceMappingURL=TexDBook.js.map