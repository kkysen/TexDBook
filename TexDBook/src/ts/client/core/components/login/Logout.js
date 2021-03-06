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
const api_1 = require("../../api");
const LoginComponent_1 = require("./LoginComponent");
let Logout = class Logout extends LoginComponent_1.LoginComponent {
    constructor(props) {
        super(props, "Logout");
    }
    inputsArgs() {
        return [];
    }
    async doLogin() {
        return api_1.api.logout();
    }
};
Logout = __decorate([
    named_1.named("Logout"),
    __metadata("design:paramtypes", [Object])
], Logout);
exports.Logout = Logout;
//# sourceMappingURL=Logout.js.map