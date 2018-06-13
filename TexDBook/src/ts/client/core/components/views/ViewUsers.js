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
const React = require("react");
const react_1 = require("react");
const named_1 = require("../../../../share/util/decorators/named");
const api_1 = require("../../api");
let ViewUsers = class ViewUsers extends react_1.Component {
    constructor(props) {
        super(props);
        this.state = { users: [] };
        (async () => {
            this.setState({ users: await api_1.api.allUsers() });
        })();
    }
    render() {
        return (React.createElement("div", { style: { margin: 100 } },
            React.createElement("div", { style: { fontSize: 30 } }, "All Users"),
            this.state.users.map(({ id, username }) => (React.createElement("div", { key: id },
                "Username: ",
                username,
                React.createElement("br", null),
                "Id: ",
                id,
                React.createElement("br", null),
                React.createElement("br", null))))));
    }
};
ViewUsers = __decorate([
    named_1.named("ViewUsers"),
    __metadata("design:paramtypes", [Object])
], ViewUsers);
exports.ViewUsers = ViewUsers;
//# sourceMappingURL=ViewUsers.js.map