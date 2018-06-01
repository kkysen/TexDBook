"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const Button_1 = require("reactstrap/lib/Button");
const Range_1 = require("../../../share/util/Range");
const InputRef_1 = require("../../util/refs/InputRef");
const InputIsbn_1 = require("./InputIsbn");
class InputIsbns extends react_1.Component {
    constructor(props) {
        super(props);
        const books = props.books;
        this.books = books;
        books.clear();
        books.addAll(Range_1.Range.new(props.startLength).map(() => ({ isbn: InputRef_1.InputRef.new(), barcodes: [] })));
        this.nodes = books.map((book, i) => this.bookInput(book, i));
    }
    bookInput(book, i) {
        return React.createElement(InputIsbn_1.InputIsbn, { isbn: book.isbn, barcodes: book.barcodes, remove: () => this.removeBook(i) });
    }
    addBook() {
        const book = { isbn: InputRef_1.InputRef.new(), barcodes: [] };
        this.books.push(book);
        this.nodes.push(this.bookInput(book, this.nodes.length));
        this.setState({});
    }
    removeBook(i) {
        this.books.slice(i, 1);
        this.nodes.slice(i, 1);
        this.setState({});
    }
    render() {
        return (React.createElement("div", null,
            this.nodes.map((node, i) => React.createElement("div", { key: i }, node)),
            React.createElement(Button_1.default, { onClick: () => this.addBook() }, "New ISBN")));
    }
}
exports.InputIsbns = InputIsbns;
//# sourceMappingURL=InputIsbns.js.map