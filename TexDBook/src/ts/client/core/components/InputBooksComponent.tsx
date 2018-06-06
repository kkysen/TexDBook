import * as React from "react";
import {ReactNode} from "react";
import {Isbn} from "../../../share/core/Isbn";
import {IsbnBook} from "../../../share/core/IsbnBook";
import {joinWords, onlyDigitsInput} from "../../../share/util/utils";
import {InputLists, MaybeSurroundingNodes, StringInputs} from "../../util/components/InputLists";
import {allBooks, Barcode} from "../Books";


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
                            const {link, image, title, authors} = book;
                            const img: ReactNode = <img src={image}/>;
                            const alt: ReactNode = (<div style={{margin: 10}}>
                                {title}
                                <br/>
                                {`by ${joinWords(authors)}`}
                            </div>);
                            return {
                                before: (<div>
                                    <a href={link}>
                                        {image ? img : alt}
                                    </a>
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
        return inputs.map(({inputs: [department], subInputs}) => ({
            department,
            books: subInputs.map(({inputs: [isbn], subInputs}) => ({
                isbn,
                barcodes: subInputs.map(({inputs: [barcode]}) => barcode),
            })),
        }));
    }
    
    protected convertToCsvRows(inputs: InputDepartment[]): InputBook[] {
        const rows: InputBook[] = [];
        for (const {department, books} of inputs) {
            for (const {isbn, barcodes} of books) {
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
    
    protected async submitInput(inputs: InputDepartment[]): Promise<void> {
        for (const {department, isbn: isbnString, barcode} of this.convertToCsvRows(inputs)) {
            const isbn: Isbn = Isbn.parse(isbnString) as Isbn;
            isbn.setDepartment(department);
            allBooks.assignBarcode({isbn, barcode});
        }
        const failedBarcodes: Barcode[] = await allBooks.sync();
        console.log(failedBarcodes);
    }
    
    
}