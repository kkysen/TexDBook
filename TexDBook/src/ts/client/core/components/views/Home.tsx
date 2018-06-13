import * as React from "react";
import {Component, ReactNode} from "react";
import {named} from "../../../../share/util/decorators/named";
import {Repeat} from "../../../util/components/Repeat";


@named("Home")
export class Home extends Component {
    
    public render(): ReactNode {
        const br = (n: number) => <Repeat times={n} render={() => <br/>}/>;
        return (
            <div>
                Welcome to TexDBook!
                {br(3)}
                Here you can track and trade all of your textbooks.
                {br(2)}
                Click <b>Upload Books</b> to upload new books
                by assigning a new barcode to a certain book by its ISBN.
                {br(2)}
                Click <b>View Books</b> to view your books.
                You can see the books you own,
                the books you have lent out,
                and the books you have borrowed.
                {br(1)}
                <i>Note</i>: If you own a book,
                it will also show up as if you are lending it to yourself as well. This is correct.
                {br(2)}
                Click <b>View Users</b> to view all other users and their IDs.
                {br(2)}
                Click <b>Make Transaction</b> to lend one of your books or borrow someone else's book.
                However, only admin accounts are allowed to make transactions for now,
                so ask an admin to make the transaction for you.
                {br(2)}
                Click <b>Logout</b>, where you can click a Logout button to log out.
                {br(3)}
                <iframe
                    width="560"
                    height="315"
                    src="https://www.youtube.com/embed/2NNeKi9yK8Y"
                    frameBorder="0"
                    {...{allow: "autoplay; encrypted-media"}}
                    allowFullScreen
                >
                
                </iframe>
            </div>
        );
    }
    
}