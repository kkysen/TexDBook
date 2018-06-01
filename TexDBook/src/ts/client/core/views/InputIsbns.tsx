import * as React from "react";
import {Component, ReactNode} from "react";
import Button from "reactstrap/lib/Button";
import {Range} from "../../../share/util/Range";
import {InputRef} from "../../util/refs/InputRef";
import {InputBooks} from "./InputBooks";
import {InputIsbn} from "./InputIsbn";

export interface BookInput {
    
    isbn: InputRef;
    barcodes: InputRef[];
    
}


export interface InputIsbnsProps {
    
    startLength: number;
    
    books: BookInput[];
    
}

export class InputIsbns extends Component<InputIsbnsProps, {}> {
    
    // noinspection JSMismatchedCollectionQueryUpdate
    private readonly books: BookInput[];
    private readonly nodes: ReactNode[];
    
    public constructor(props: InputIsbnsProps) {
        super(props);
        const books: BookInput[] = props.books;
        this.books = books;
        books.clear();
        books.addAll(Range.new(props.startLength).map(() => ({isbn: InputRef.new(), barcodes: []})));
        this.nodes = books.map((book, i) => this.bookInput(book, i));
    }
    
    private bookInput(book: BookInput, i: number): ReactNode {
        return <InputIsbn isbn={book.isbn} barcodes={book.barcodes} remove={() => this.removeBook(i)}/>;
    }
    
    private addBook(): void {
        const book: BookInput = {isbn: InputRef.new(), barcodes: []};
        this.books.push(book);
        this.nodes.push(this.bookInput(book, this.nodes.length));
        this.setState({});
    }
    
    private removeBook(i: number): void {
        this.books.slice(i, 1);
        this.nodes.slice(i, 1);
        this.setState({});
    }
    
    public render(): ReactNode {
        return (<div>
            {this.nodes.map((node, i) => <div key={i}>{node}</div>)}
            <Button onClick={() => this.addBook()}>New ISBN</Button>
        </div>);
    }
    
}