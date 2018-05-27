"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fetchJson_1 = require("../../util/fetch/fetchJson");
const LoginComponent_1 = require("./LoginComponent");
class Logout extends LoginComponent_1.LoginComponent {
    constructor(props) {
        super(props, "Logout");
    }
    inputsArgs() {
        return [];
    }
    async doLogin() {
        return await fetchJson_1.fetchJson("/logout", undefined, {
            cache: "reload",
        });
    }
}
exports.Logout = Logout;
//# sourceMappingURL=Logout.js.map