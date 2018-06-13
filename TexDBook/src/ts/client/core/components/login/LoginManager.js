"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const bindProps_1 = require("../../../util/bindProps");
const Repeat_1 = require("../../../util/components/Repeat");
const ViewRouter_1 = require("../../../util/components/ViewRouter");
const TexDBook_1 = require("../../TexDBook");
const Home_1 = require("../views/Home");
const MakeTransaction_1 = require("../views/MakeTransaction");
const UploadBooks_1 = require("../views/UploadBooks");
const ViewBooks_1 = require("../views/ViewBooks");
const ViewUsers_1 = require("../views/ViewUsers");
const Welcome_1 = require("../views/Welcome");
const CreateAccount_1 = require("./CreateAccount");
const Login_1 = require("./Login");
const Logout_1 = require("./Logout");
class LoginManager extends react_1.Component {
    constructor(props) {
        super(props);
        this.logIn = (loggedIn) => {
            TexDBook_1.TexDBook.isLoggedIn = loggedIn._clone();
            this.setState(() => loggedIn);
        };
        this.bindLogin = (login) => {
            const { logIn, state: { message } } = this;
            return bindProps_1.bindProps(login, { onLogin: logIn, message });
        };
        this.state = TexDBook_1.TexDBook.isLoggedIn._clone();
    }
    renderLogin() {
        const { bindLogin, state: { isLoggedIn } } = this;
        if (isLoggedIn) {
            return React.createElement(ViewRouter_1.ViewRouter, { name: "TexDBook", views: [
                    {
                        path: "/",
                        render: () => location.hash.endsWith("/") && React.createElement(Home_1.Home, null),
                        name: Home_1.Home.name,
                    },
                    UploadBooks_1.UploadBooks,
                    ViewBooks_1.ViewBooks,
                    ViewUsers_1.ViewUsers,
                    MakeTransaction_1.MakeTransaction,
                    bindLogin(Logout_1.Logout),
                ] });
        }
        else {
            return React.createElement(ViewRouter_1.ViewRouter, { name: "TexDBook", views: [
                    {
                        path: "/",
                        render: () => location.hash.endsWith("/") && React.createElement(Welcome_1.Welcome, null),
                        name: Welcome_1.Welcome.name,
                    },
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