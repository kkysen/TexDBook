import * as React from "react";
import {Component, ReactNode} from "react";
import {Nav, NavItem, NavLink} from "reactstrap";
import {named} from "../../../../share/util/decorators/named";
import {Inputs} from "../../../util/components/Inputs";
import {InputRef} from "../../../util/refs/InputRef";
import {api} from "../../api";


interface MakeTransactionState {
    
    borrowing: boolean;
    
}


@named("MakeTransaction")
export class MakeTransaction extends Component<{}, MakeTransactionState> {
    
    private readonly borrowingCheckBox: InputRef = InputRef.new();
    private readonly otherUser: InputRef = InputRef.new();
    private readonly barcode: InputRef = InputRef.new();
    
    public constructor(props: {}) {
        super(props);
        this.state = {borrowing: true};
    }
    
    private readonly onTransaction = async (): Promise<void> => {
        await api.makeTransaction(this.state.borrowing, parseInt(this.otherUser()), this.barcode());
    };
    
    private readonly setBorrowing = (borrowing: boolean): () => void => {
        return () => this.setState({borrowing});
    };
    
    public render(): ReactNode {
        const {
            state: {borrowing},
            setBorrowing,
            onTransaction,
            otherUser,
            barcode,
        } = this;
        
        const name: string = borrowing ? "Borrow" : "Lend";
        
        return (
            <div>
                Make Transaction
                <br/>
                <br/>
                <Nav tabs>
                    <NavItem>
                        <NavLink className={borrowing ? "active" : ""} onClick={setBorrowing(true)}>
                            Borrowing
                        </NavLink>
                        <NavLink className={borrowing ? "" : "active"} onClick={setBorrowing(false)}>
                            Lending
                        </NavLink>
                    </NavItem>
                </Nav>
                <br/>
                <Inputs
                    key={name}
                    args={[
                        [otherUser, "number", `${name}er's ID`],
                        [barcode, "text", "Barcode"],
                    ]}
                    onEnter={onTransaction}
                />
            </div>
        );
    }
    
}