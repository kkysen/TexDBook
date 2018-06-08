import * as React from "react";
import {Component, ReactNode} from "react";
import {Book} from "../../../../share/core/Book";
import {capitalize, joinWords} from "../../../../share/util/utils";
import {api, BookState} from "../../api";

interface ViewBooksState {
    
    readonly books: {
        own: Book[];
        lent: Book[];
        borrowed: Book[];
    };
    
}

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
        const books = {
            ...this.state.books,
            [bookState]: await api.userBooks(bookState),
        };
        console.log("fetchBooks", bookState, books);
        this.setState({
            books: books,
        });
    };
    
    private readonly renderBooks = (bookState: BookState): ReactNode => {
        console.log(bookState, this.state.books[bookState]);
        return (<div>
            <div style={{fontSize: "large"}}>{capitalize(bookState)}</div>
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
                    ISBN: {isbn}, Department: {department}
                    <br/>
                    <a href={link}>{title}</a> by {joinWords(authors)}
                    <br/>
                    {description}
                    <br/>
                    <a href={previewLink}><img src={image}/></a>
                </div>);
            })}
        </div>);
    };
    
    public render(): ReactNode {
        return (
            <div>
                View Books
                {this.bookStates.map(bookState => (
                    <div key={bookState}>
                        {this.renderBooks(bookState)}
                    </div>
                ))}
            </div>
        );
    }
    
}