"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const named_1 = require("../../../../share/util/decorators/named");
let Welcome = class Welcome extends react_1.Component {
    render() {
        return (React.createElement("div", null,
            React.createElement("div", { style: { fontSize: "larger" } }, "Welcome to TexDBook!"),
            React.createElement("br", null),
            React.createElement("br", null),
            React.createElement("div", { style: { fontSize: "large" } }, "To get started, first login or create an account.")));
    }
};
Welcome = __decorate([
    named_1.named("Welcome")
], Welcome);
exports.Welcome = Welcome;
//# sourceMappingURL=Welcome.js.map