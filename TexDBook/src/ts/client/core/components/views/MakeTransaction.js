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
const reactstrap_1 = require("reactstrap");
const named_1 = require("../../../../share/util/decorators/named");
const Inputs_1 = require("../../../util/components/Inputs");
const InputRef_1 = require("../../../util/refs/InputRef");
const api_1 = require("../../api");
let MakeTransaction = class MakeTransaction extends react_1.Component {
    constructor(props) {
        super(props);
        this.borrowingCheckBox = InputRef_1.InputRef.new();
        this.otherUser = InputRef_1.InputRef.new();
        this.barcode = InputRef_1.InputRef.new();
        this.onTransaction = async () => {
            await api_1.api.makeTransaction(this.state.borrowing, parseInt(this.otherUser()), this.barcode());
        };
        this.setBorrowing = (borrowing) => {
            return () => this.setState({ borrowing });
        };
        this.state = { borrowing: true };
    }
    render() {
        const { state: { borrowing }, setBorrowing, onTransaction, otherUser, barcode, } = this;
        const name = borrowing ? "Borrow" : "Lend";
        return (React.createElement("div", null,
            "Make Transaction",
            React.createElement("br", null),
            React.createElement("br", null),
            React.createElement(reactstrap_1.Nav, { tabs: true },
                React.createElement(reactstrap_1.NavItem, null,
                    React.createElement(reactstrap_1.NavLink, { className: borrowing ? "active" : "", onClick: setBorrowing(true) }, "Borrowing"),
                    React.createElement(reactstrap_1.NavLink, { className: borrowing ? "" : "active", onClick: setBorrowing(false) }, "Lending"))),
            React.createElement("br", null),
            React.createElement(Inputs_1.Inputs, { key: name, args: [
                    [otherUser, "number", `${name}er's ID`],
                    [barcode, "text", "Barcode"],
                ], onEnter: onTransaction })));
    }
};
MakeTransaction = __decorate([
    named_1.named("MakeTransaction"),
    __metadata("design:paramtypes", [Object])
], MakeTransaction);
exports.MakeTransaction = MakeTransaction;
//# sourceMappingURL=MakeTransaction.js.map