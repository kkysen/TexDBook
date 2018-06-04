import * as React from "react";
import {InputsArgs} from "../../../util/components/Inputs";
import {RestResponse} from "../../../util/fetch/fetchJson";
import {InputRef} from "../../../util/refs/InputRef";
import {api} from "../../api";
import {IsLoggedIn} from "../../TexDBook";
import {LoginComponent, LoginProps, loginUser} from "./LoginComponent";


export class CreateAccount extends LoginComponent {
    
    private readonly username: InputRef = InputRef.new();
    private readonly password: InputRef = InputRef.new();
    private readonly passwordConfirmation: InputRef = InputRef.new();
    // private readonly email: InputRef = InputRef.new();
    // private readonly phone: InputRef = InputRef.new();
    
    public constructor(props: LoginProps) {
        super(props, "Create Account");
    }
    
    protected inputsArgs(): InputsArgs {
        return [
            [this.username, "text", "Username"],
            [this.password, "password", "Password"],
            [this.passwordConfirmation, "password", "Confirm Password"],
            // [this.email, "email", "Email"],
            // [this.phone, "tel", "Phone"],
        ];
    }
    
    protected async doLogin(): Promise<IsLoggedIn> {
        const username: string = this.username();
        const password: string = this.password();
        const response: RestResponse<{}> = await api.createAccount(username, password, this.passwordConfirmation());
        if (response.success) {
            return await loginUser(username, password);
        } else {
            return {
                isLoggedIn: false,
                message: response.message,
            };
        }
    }
    
}