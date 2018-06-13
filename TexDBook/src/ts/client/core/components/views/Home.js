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
const Repeat_1 = require("../../../util/components/Repeat");
let Home = class Home extends react_1.Component {
    render() {
        const br = (n) => React.createElement(Repeat_1.Repeat, { times: n, render: () => React.createElement("br", null) });
        return (React.createElement("div", null,
            "Welcome to TexDBook!",
            br(3),
            "Here you can track and trade all of your textbooks.",
            br(2),
            "Click ",
            React.createElement("b", null, "Upload Books"),
            " to upload new books by assigning a new barcode to a certain book by its ISBN.",
            br(2),
            "Click ",
            React.createElement("b", null, "View Books"),
            " to view your books. You can see the books you own, the books you have lent out, and the books you have borrowed.",
            br(1),
            React.createElement("i", null, "Note"),
            ": If you own a book, it will also show up as if you are lending it to yourself as well. This is correct.",
            br(2),
            "Click ",
            React.createElement("b", null, "View Users"),
            " to view all other users and their IDs.",
            br(2),
            "Click ",
            React.createElement("b", null, "Make Transaction"),
            " to lend one of your books or borrow someone else's book. However, only admin accounts are allowed to make transactions for now, so ask an admin to make the transaction for you.",
            br(2),
            "Click ",
            React.createElement("b", null, "Logout"),
            ", where you can click a Logout button to log out.",
            br(3),
            React.createElement("iframe", Object.assign({ width: "560", height: "315", src: "https://www.youtube.com/embed/2NNeKi9yK8Y", frameBorder: "0" }, { allow: "autoplay; encrypted-media" }, { allowFullScreen: true }))));
    }
};
Home = __decorate([
    named_1.named("Home")
], Home);
exports.Home = Home;
//# sourceMappingURL=Home.js.map