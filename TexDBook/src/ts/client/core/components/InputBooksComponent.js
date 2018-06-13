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
                            const { link, image, title, authors } = book;
                            const img = React.createElement("img", { src: image });
                            const alt = (React.createElement("div", { style: { margin: 10 } },
                                title,
                                React.createElement("br", null),
                                `by ${utils_1.joinWords(authors)}`));
                            return {
                                before: (React.createElement("div", null,
                                    React.createElement("a", { href: link, target: "_blank" }, image ? img : alt))),
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
        return inputs.map(({ inputs: [department], subInputs }) => ({
            department,
            books: subInputs.map(({ inputs: [isbn], subInputs }) => ({
                isbn,
                barcodes: subInputs.map(({ inputs: [barcode] }) => barcode),
            })),
        }));
    }
    convertToCsvRows(inputs) {
        const rows = [];
        for (const { department, books } of inputs) {
            for (const { isbn, barcodes } of books) {
                for (const barcode of barcodes) {
                    rows.push({
                        department,
                        isbn,
                        barcode,
                    });
                }
            }
        }
        return rows;
    }
    async submitInput(inputs) {
        for (const { department, isbn: isbnString, barcode } of this.convertToCsvRows(inputs)) {
            const isbn = Isbn_1.Isbn.parse(isbnString);
            isbn.setDepartment(department);
            Books_1.allBooks.assignBarcode({ isbn, barcode });
        }
        const failedBarcodes = await Books_1.allBooks.sync();
        console.log(failedBarcodes);
    }
}
exports.InputBooksComponent = InputBooksComponent;
//# sourceMappingURL=InputBooksComponent.js.map