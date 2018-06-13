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
const utils_1 = require("../../../../share/util/utils");
const named_1 = require("../../../../share/util/decorators/named");
const api_1 = require("../../api");
let ViewBooks = class ViewBooks extends react_1.Component {
    constructor(props) {
        super(props);
        this.fetchBooks = async (bookState) => {
            const newBooks = await api_1.api.userBooks(bookState); // DO NOT inline this variable
            this.setState({
                books: {
                    ...this.state.books,
                    [bookState]: newBooks,
                },
            });
        };
        this.renderBooks = (bookState) => {
            return (React.createElement("div", null,
                React.createElement("div", { style: { fontSize: 20, textAlign: "center" } }, utils_1.capitalize(bookState) + " Books"),
                React.createElement("br", null),
                this.state.books[bookState].map((book, i) => {
                    const { isbn: { book: { isbn, department, image, title, authors, description, link, previewLink, }, }, barcode, owner, borrower, lender, } = book;
                    return (React.createElement("div", { key: i },
                        React.createElement("a", { href: previewLink, target: "_blank" },
                            React.createElement("img", { src: image })),
                        React.createElement("br", null),
                        React.createElement("a", { href: link, target: "_blank" }, title),
                        " by ",
                        utils_1.joinWords(authors),
                        React.createElement("br", null),
                        "ISBN: ",
                        isbn,
                        React.createElement("br", null),
                        "Barcode: ",
                        barcode,
                        React.createElement("br", null),
                        "Department: ",
                        department,
                        React.createElement("br", null),
                        React.createElement("br", null),
                        description));
                })));
        };
        this.state = {
            books: {
                own: [],
                lent: [],
                borrowed: [],
            },
        };
        this.bookStates = Object.keys(this.state.books);
        this.bookStates.forEach(this.fetchBooks);
    }
    render() {
        return (React.createElement("div", { style: { margin: 100 } },
            React.createElement("br", null),
            React.createElement("br", null),
            React.createElement("div", { style: { fontSize: 40, textAlign: "center" } }, "View Books"),
            React.createElement("br", null),
            React.createElement("br", null),
            React.createElement("hr", null),
            React.createElement("br", null),
            this.bookStates.map(bookState => (React.createElement("div", { key: bookState },
                this.renderBooks(bookState),
                React.createElement("br", null),
                React.createElement("hr", null),
                React.createElement("br", null))))));
    }
};
ViewBooks = __decorate([
    named_1.named("ViewBooks"),
    __metadata("design:paramtypes", [Object])
], ViewBooks);
exports.ViewBooks = ViewBooks;
//# sourceMappingURL=ViewBooks.js.map