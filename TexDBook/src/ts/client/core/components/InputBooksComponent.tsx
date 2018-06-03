import * as React from "react";
import {Isbn} from "../../../share/core/Isbn";
import {IsbnBook} from "../../../share/core/IsbnBook";
import {onlyDigitsInput} from "../../../share/util/utils";
import {InputLists, MaybeSurroundingNodes, StringInputs} from "../../util/components/InputLists";
import {AllBooks} from "../Books";


export interface InputBook {
    
    isbn: string,
    barcodes: string[],
    
}

export interface InputDepartment {
    
    department: string,
    books: InputBook[],
    
}

export interface InputBooks extends Array<InputDepartment> {

}


export class InputBooksComponent extends InputLists<InputBooks> {
    
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
                    AllBooks.addIsbn(isbn.isbn13);
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
                onInput(): void {
                    onlyDigitsInput(this);
                    
                },
            },
        ]);
    }
    
    protected convertInputs(inputs: StringInputs[]): InputBooks {
        return inputs.map(({inputs, subInputs}) => ({
            department: inputs[0],
            books: subInputs.map(({inputs, subInputs}) => ({
                isbn: inputs[0],
                barcodes: subInputs.map(({inputs}) => inputs[0]),
            })),
        }));
    }
    
    protected onSubmit(input: InputBooks): void {
    
    }
    
    
}