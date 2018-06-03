"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("../../api");
const LoginComponent_1 = require("./LoginComponent");
class Logout extends LoginComponent_1.LoginComponent {
    constructor(props) {
        super(props, "Logout");
    }
    inputsArgs() {
        return [];
    }
    async doLogin() {
        return api_1.api.logout();
    }
}
exports.Logout = Logout;
//# sourceMappingURL=Logout.js.map