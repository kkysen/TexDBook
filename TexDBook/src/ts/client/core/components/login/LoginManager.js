"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const bindProps_1 = require("../../../util/bindProps");
const Repeat_1 = require("../../../util/components/Repeat");
const ViewRouter_1 = require("../../../util/components/ViewRouter");
const TexDBook_1 = require("../../TexDBook");
const CreateAccount_1 = require("./CreateAccount");
const Home_1 = require("../views/Home");
const Login_1 = require("./Login");
const Logout_1 = require("./Logout");
const MakeTransaction_1 = require("../views/MakeTransaction");
const UploadBooks_1 = require("../views/UploadBooks");
const ViewBooks_1 = require("../views/ViewBooks");
class LoginManager extends react_1.Component {
    constructor(props) {
        super(props);
        console.log(this.props);
        this.state = TexDBook_1.TexDBook.isLoggedIn._clone();
    }
    logIn(loggedIn) {
        TexDBook_1.TexDBook.isLoggedIn = loggedIn._clone();
        this.setState(() => loggedIn);
    }
    renderLogin() {
        const logIn = this.logIn.bind(this);
        const bindLogin = (login) => {
            return bindProps_1.bindProps(login, { onLogin: logIn, message: this.state.message });
        };
        if (this.state.isLoggedIn) {
            return React.createElement(ViewRouter_1.ViewRouter, { name: "TexDBook", views: [
                    Home_1.Home, ViewBooks_1.ViewBooks, UploadBooks_1.UploadBooks, MakeTransaction_1.MakeTransaction, bindLogin(Logout_1.Logout)
                ] });
        }
        else {
            return React.createElement(ViewRouter_1.ViewRouter, { name: "TexDBook", views: [
                    bindLogin(Login_1.Login),
                    bindLogin(CreateAccount_1.CreateAccount),
                ] });
        }
    }
    render() {
        return (React.createElement("div", null,
            this.renderLogin(),
            React.createElement(Repeat_1.Repeat, { times: 5, render: () => React.createElement("br", null) })));
    }
}
exports.LoginManager = LoginManager;
//# sourceMappingURL=LoginManager.js.map