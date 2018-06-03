"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const InputRef_1 = require("../../../util/refs/InputRef");
const LoginComponent_1 = require("./LoginComponent");
class Login extends LoginComponent_1.LoginComponent {
    constructor(props) {
        super(props, "Login");
        this.username = InputRef_1.InputRef.new();
        this.password = InputRef_1.InputRef.new();
    }
    inputsArgs() {
        return [
            [this.username, "text", "Username"],
            [this.password, "password", "Password"],
        ];
    }
    async doLogin() {
        return await LoginComponent_1.loginUser(this.username(), this.password());
    }
}
exports.Login = Login;
//# sourceMappingURL=Login.js.map