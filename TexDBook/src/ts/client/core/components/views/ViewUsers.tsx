import * as React from "react";
import {Component, ReactNode} from "react";
import {User} from "../../../../share/core/User";
import {named} from "../../../../share/util/decorators/named";
import {api} from "../../api";


interface ViewUsersState {
    
    users: User[];
    
}

@named("ViewUsers")
export class ViewUsers extends Component<{}, ViewUsersState> {
    
    public constructor(props: {}) {
        super(props);
        this.state = {users: []};
        (async () => {
            this.setState({users: await api.allUsers()});
        })();
    }
    
    public render(): ReactNode {
        return (<div style={{margin: 100}}>
            <div style={{fontSize: 30}}>All Users</div>
            {this.state.users.map(({id, username}) => (
                <div key={id}>
                    Username: {username}
                    <br/>
                    Id: {id}
                    <br/>
                    <br/>
                </div>
            ))}
        </div>);
    }
    
}