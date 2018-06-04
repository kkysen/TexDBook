import * as React from "react";
import {Isbn} from "../../../share/core/Isbn";
import {IsbnBook} from "../../../share/core/IsbnBook";
import {onlyDigitsInput} from "../../../share/util/utils";
import {InputLists, MaybeSurroundingNodes, StringInputs} from "../../util/components/InputLists";
import {allBooks} from "../Books";


export interface InputIsbn {
    
    isbn: string,
    barcodes: string[],
    
}

export interface InputDepartment {
    
    department: string,
    books: InputIsbn[],
    
}

interface InputBook {
    
    department: string;
    isbn: string;
    barcode: string;
    
}


export class InputBooksComponent extends InputLists<InputDepartment, InputBook> {
    
    public constructor(props: {}) {
        super(props, "Upload Books", [
            {
                name: "Department",
                onInput(): void {
                
                }
            }, {
                name: "ISBN",
                onInput(): MaybeSurroundingNodes {
                    onlyDigitsInput(this);
                    const isbn: Isbn | null = Isbn.parse(this.value);
                    if (isbn === null) {
                        return {
                            before: "Invalid ISBN",
                        };
                    }
                    allBooks.addIsbn(isbn.isbn13);
                    return (async () => {
                        try {
                            const book: IsbnBook = await isbn.fetchBook();
                            const imgUrl: string = book.imageLinks.smallThumbnail || book.imageLinks.thumbnail;
                            return {
                                before: (<div>
                                    <img src={imgUrl}/>
                                </div>),
                            };
                        } catch (e) {
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
                onInput(): MaybeSurroundingNodes {
                    onlyDigitsInput(this);
                    if (allBooks.hasBarcode(this.value)) {
                        return {
                            before: "Barcode Exists",
                        };
                    }
                    // TODO need to access parent input here
                },
            },
        ]);
    }
    
    protected convertInputs(inputs: StringInputs[]): InputDepartment[] {
        return inputs.map(({inputs, subInputs}) => ({
            department: inputs[0],
            books: subInputs.map(({inputs, subInputs}) => ({
                isbn: inputs[0],
                barcodes: subInputs.map(({inputs}) => inputs[0]),
            })),
        }));
    }
    
    protected convertToCsvRows(inputs: InputDepartment[]): InputBook[] {
        const rows: InputBook[] = [];
        for (const {department, books} of inputs) {
            for (const {isbn, barcodes} of books) {
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
    
    protected submitInput(inputs: InputDepartment[]): void {
        this.invalidate(true);
    }
    
    
}