"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const hash_1 = require("../../util/hash");
const TexDBook_1 = require("../TexDBook");
const login = async function (username, password) {
    // pre hash server side for extra security
    const hashedPassword = await hash_1.SHA._256.hash(password);
    const response = await (await fetch("/login", {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
            password: hashedPassword,
        }),
    })).json();
    const isLoggedIn = response.isLoggedIn;
    if (isLoggedIn) {
        TexDBook_1.TexDBook.isLoggedIn = true;
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