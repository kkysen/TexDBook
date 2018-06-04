"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const Isbn_1 = require("../../../share/core/Isbn");
const utils_1 = require("../../../share/util/utils");
const InputLists_1 = require("../../util/components/InputLists");
const Books_1 = require("../Books");
class InputBooksComponent extends InputLists_1.InputLists {
    constructor(props) {
        super(props, "Upload Books", [
            {
                name: "Department",
                onInput() {
                }
            }, {
                name: "ISBN",
                onInput() {
                    utils_1.onlyDigitsInput(this);
                    const isbn = Isbn_1.Isbn.parse(this.value);
                    if (isbn === null) {
                        return {
                            before: "Invalid ISBN",
                        };
                    }
                    Books_1.allBooks.addIsbn(isbn.isbn13);
                    return (async () => {
                        try {
                            const book = await isbn.fetchBook();
                            const imgUrl = book.imageLinks.smallThumbnail || book.imageLinks.thumbnail;
                            return {
                                before: (React.createElement("div", null,
                                    React.createElement("img", { src: imgUrl }))),
                            };
                        }
                        catch (e) {
                            console.error(e);
                            return {
                                before: "Valid ISBN",
                                after: "Network Error",
                            };
                        }
                    })();
                },
            }, {
                name: "Barcode",
                onInput() {
                    utils_1.onlyDigitsInput(this);
                    if (Books_1.allBooks.hasBarcode(this.value)) {
                        return {
                            before: "Barcode Exists",
                        };
                    }
                    // TODO need to access parent input here
                },
            },
        ]);
    }
    convertInputs(inputs) {
        return inputs.map(({ inputs, subInputs }) => ({
            department: inputs[0],
            books: subInputs.map(({ inputs, subInputs }) => ({
                isbn: inputs[0],
                barcodes: subInputs.map(({ inputs }) => inputs[0]),
            })),
        }));
    }
    convertToCsvRows(inputs) {
        const rows = [];
        for (const { department, books } of inputs) {
            for (const { isbn, barcodes } of books) {
                for (const barcode of barcodes) {
                    rows.push({
                        department: department,
                        isbn: isbn,
                        barcode: barcode,
                    });
                }
            }
        }
        return rows;
    }
    submitInput(inputs) {
        this.invalidate(true);
    }
}
exports.InputBooksComponent = InputBooksComponent;
//# sourceMappingURL=InputBooksComponent.js.map