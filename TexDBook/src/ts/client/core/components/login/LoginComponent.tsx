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
    
    protected constructor(props: LoginProps, name?: string) {
        super(props);
        this.name = name || separateClassName(this.constructor.name);
    }
    
    protected abstract inputsArgs(): InputsArgs;
    
    protected abstract doLogin(): Promise<IsLoggedIn>;
    
    private readonly handleClick = async (): Promise<void> => {
        this.props.onLogin(await this.doLogin());
    };
    
    public render(): ReactNode {
        // TODO style name and message
        const {name, props: {message}, handleClick} = this;
        return (
            <div>
                {name}
                <br/>
                {message}
                <br/>
                <Inputs args={this.inputsArgs()} onEnter={handleClick}/>
                <br/>
                <Button color="primary" onClick={handleClick}>{name}</Button>
            </div>
        );
    }
    
}


export const loginUser = async function(username: string, password: string): Promise<IsLoggedIn> {
    return api.login(username, password);
};