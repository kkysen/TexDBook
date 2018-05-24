"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const react_router_1 = require("react-router");
const anyWindow_1 = require("../../util/anyWindow");
const fetchJson_1 = require("../../util/fetch/fetchJson");
const hash_1 = require("../../util/hash");
const TexDBook_1 = require("../TexDBook");
const ViewBooks_1 = require("./ViewBooks");
const onLogin = anyWindow_1.anyWindow.onLogin = function () {
    react_router_1.withRouter(({ history }) => {
        history.push(ViewBooks_1.ViewBooks.name);
        return null;
    });
};
const onLoginFailure = function () {
};
const login = async function (username, password) {
    // pre hash server side for extra security
    const hashedPassword = await hash_1.SHA._256.hash(password);
    const isLoggedIn = (await fetchJson_1.fetchJson("/login", {
        username: username,
        password: hashedPassword,
    }, {
        cache: "reload",
    })).isLoggedIn;
    if (isLoggedIn) {
        TexDBook_1.TexDBook.isLoggedIn = true;
        onLogin();
    }
    else {
        onLoginFailure();
    }
    // TODO change stuff after login or after failed login
    return isLoggedIn;
};
class Login extends react_1.Component {
    render() {
        return (React.createElement("div", null, "Login"));
    }
}
exports.Login = Login;
//# sourceMappingURL=Login.js.map