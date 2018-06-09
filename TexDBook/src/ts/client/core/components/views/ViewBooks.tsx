import * as React from "react";
import {Component, ReactNode} from "react";
import {Book} from "../../../../share/core/Book";
import {capitalize, joinWords} from "../../../../share/util/utils";
import {named} from "../../../../share/util/decorators/named";
import {api, BookState} from "../../api";

interface ViewBooksState {
    
    readonly books: {
        own: Book[];
        lent: Book[];
        borrowed: Book[];
    };
    
}

@named("ViewBooks")
export class ViewBooks extends Component<{}, ViewBooksState> {
    
    private readonly bookStates: BookState[];
    
    public constructor(props: {}) {
        super(props);
        this.state = {
            books: {
                own: [],
                lent: [],
                borrowed: [],
            },
        };
        this.bookStates = Object.keys(this.state.books) as BookState[];
        this.bookStates.forEach(this.fetchBooks);
    }
    
    private readonly fetchBooks = async (bookState: BookState): Promise<void> => {
        const newBooks = await api.userBooks(bookState); // DO NOT inline this variable
        this.setState({
            books: {
                ...this.state.books,
                [bookState]: newBooks,
            },
        });
    };
    
    private readonly renderBooks = (bookState: BookState): ReactNode => {
        return (<div>
            <div style={{fontSize: 20, textAlign: "center"}}>{capitalize(bookState) + " Books"}</div>
            <br/>
            {this.state.books[bookState].map((book, i) => {
                const {
                    isbn: {
                        book: {
                            isbn,
                            department,
                            image,
                            title,
                            authors,
                            description,
                            link,
                            previewLink,
                        },
                    },
                    barcode,
                    owner,
                    borrower,
                    lender,
                } = book;
                return (<div key={i}>
                    <a href={previewLink} target="_blank"><img src={image}/></a>
                    <br/>
                    <a href={link} target="_blank">{title}</a> by {joinWords(authors)}
                    <br/>
                    ISBN: {isbn}
                    <br/>
                    Department: {department}
                    <br/>
                    <br/>
                    {description}
                </div>);
            })}
        </div>);
    };
    
    public render(): ReactNode {
        return (
            <div style={{margin: 100}}>
                <br/>
                <br/>
                <div style={{fontSize: 40, textAlign: "center"}}>View Books</div>
                <br/>
                <br/>
                <hr/>
                <br/>
                {this.bookStates.map(bookState => (
                    <div key={bookState}>
                        {this.renderBooks(bookState)}
                        <br/>
                        <hr/>
                        <br/>
                    </div>
                ))}
            </div>
        );
    }
    
}