"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const InputRef_1 = require("../../util/refs/InputRef");
const api_1 = require("../api");
const LoginComponent_1 = require("./LoginComponent");
class CreateAccount extends LoginComponent_1.LoginComponent {
    // private readonly email: InputRef = InputRef.new();
    // private readonly phone: InputRef = InputRef.new();
    constructor(props) {
        super(props, "Create Account");
        this.username = InputRef_1.InputRef.new();
        this.password = InputRef_1.InputRef.new();
        this.passwordConfirmation = InputRef_1.InputRef.new();
    }
    inputsArgs() {
        return [
            [this.username, "text", "Username"],
            [this.password, "password", "Password"],
            [this.passwordConfirmation, "password", "Confirm Password"],
        ];
    }
    async doLogin() {
        const username = this.username();
        const password = this.password();
        const response = await api_1.api.createAccount(username, password, this.passwordConfirmation());
        if (response.success) {
            return await LoginComponent_1.loginUser(username, password);
        }
        else {
            return {
                isLoggedIn: false,
                message: response.message,
            };
        }
    }
}
exports.CreateAccount = CreateAccount;
//# sourceMappingURL=CreateAccount.js.map