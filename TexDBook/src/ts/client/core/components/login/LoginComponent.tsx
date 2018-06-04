import * as React from "react";
import {Component, ReactNode} from "react";
import {Button} from "reactstrap";
import {separateClassName} from "../../../../share/util/utils";
import {Inputs, InputsArgs} from "../../../util/components/Inputs";
import {api} from "../../api";
import {IsLoggedIn} from "../../TexDBook";


export interface LoginProps {
    
    onLogin(loggedIn: IsLoggedIn): void;
    
    readonly message?: string;
    
}

export interface LoginState {

}

export abstract class LoginComponent extends Component<LoginProps, LoginState> implements LoginComponent {
    
    private readonly name: string;
    private readonly handleClick: () => Promise<void>;
    
    protected constructor(props: LoginProps, name?: string) {
        super(props);
        this.name = name || separateClassName(this.constructor.name);
        this.handleClick = async () => this.props.onLogin(await this.doLogin());
    }
    
    protected abstract inputsArgs(): InputsArgs;
    
    protected abstract doLogin(): Promise<IsLoggedIn>;
    
    public render(): ReactNode {
        // TODO style name and message
        return (
            <div>
                {this.name}
                <br/>
                {this.props.message}
                <br/>
                <Inputs args={this.inputsArgs()} onEnter={this.handleClick}/>
                <br/>
                <Button color="primary" onClick={this.handleClick}>{this.name}</Button>
            </div>
        );
    }
    
}


export const loginUser = async function(username: string, password: string): Promise<IsLoggedIn> {
    return api.login(username, password);
};