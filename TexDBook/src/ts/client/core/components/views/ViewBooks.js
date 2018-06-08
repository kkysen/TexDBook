"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const utils_1 = require("../../../../share/util/utils");
const api_1 = require("../../api");
class ViewBooks extends react_1.Component {
    constructor(props) {
        super(props);
        this.fetchBooks = async (bookState) => {
            const books = {
                ...this.state.books,
                [bookState]: await api_1.api.userBooks(bookState),
            };
            console.log("fetchBooks", bookState, books);
            this.setState({
                books: books,
            });
        };
        this.renderBooks = (bookState) => {
            console.log(bookState, this.state.books[bookState]);
            return (React.createElement("div", null,
                React.createElement("div", { style: { fontSize: "large" } }, utils_1.capitalize(bookState)),
                this.state.books[bookState].map((book, i) => {
                    const { isbn: { book: { isbn, department, image, title, authors, description, link, previewLink, }, }, barcode, owner, borrower, lender, } = book;
                    return (React.createElement("div", { key: i },
                        "ISBN: ",
                        isbn,
                        ", Department: ",
                        department,
                        React.createElement("br", null),
                        React.createElement("a", { href: link }, title),
                        " by ",
                        utils_1.joinWords(authors),
                        React.createElement("br", null),
                        description,
                        React.createElement("br", null),
                        React.createElement("a", { href: previewLink },
                            React.createElement("img", { src: image }))));
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
        return (React.createElement("div", null,
            "View Books",
            this.bookStates.map(bookState => (React.createElement("div", { key: bookState },
                this.renderBooks(bookState),
                React.createElement("br", null),
                React.createElement("hr", null),
                React.createElement("br", null))))));
    }
}
exports.ViewBooks = ViewBooks;
//# sourceMappingURL=ViewBooks.js.map