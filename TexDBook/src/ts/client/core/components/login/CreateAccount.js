"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const named_1 = require("../../../../share/util/decorators/named");
const InputRef_1 = require("../../../util/refs/InputRef");
const api_1 = require("../../api");
const LoginComponent_1 = require("./LoginComponent");
let CreateAccount = class CreateAccount extends LoginComponent_1.LoginComponent {
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
        const { success, message } = await api_1.api.createAccount(username, password, this.passwordConfirmation());
        if (success) {
            return await LoginComponent_1.loginUser(username, password);
        }
        else {
            return {
                isLoggedIn: false,
                message,
            };
        }
    }
};
CreateAccount = __decorate([
    named_1.named("CreateAccount"),
    __metadata("design:paramtypes", [Object])
], CreateAccount);
exports.CreateAccount = CreateAccount;
//# sourceMappingURL=CreateAccount.js.map