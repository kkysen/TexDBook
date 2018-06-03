import * as React from "react";
import {InputsArgs} from "../../../util/components/Inputs";
import {InputRef} from "../../../util/refs/InputRef";
import {IsLoggedIn, LoginComponent, LoginProps, loginUser} from "./LoginComponent";


export class Login extends LoginComponent {
    
    private readonly username: InputRef = InputRef.new();
    private readonly password: InputRef = InputRef.new();
    
    public constructor(props: LoginProps) {
        super(props, "Login");
    }
    
    protected inputsArgs(): InputsArgs {
        return [
            [this.username, "text", "Username"],
            [this.password, "password", "Password"],
        ];
    }
    
    protected async doLogin(): Promise<IsLoggedIn> {
        return await loginUser(this.username(), this.password());
    }
    
}