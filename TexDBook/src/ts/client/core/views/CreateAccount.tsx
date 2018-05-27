import * as React from "react";
import {InputsArgs} from "../../util/components/Inputs";
import {fetchJson} from "../../util/fetch/fetchJson";
import {InputRef} from "../../util/refs/InputRef";
import {IsLoggedIn, LoginArgs, LoginComponent, LoginProps, loginUser} from "./LoginComponent";


type CreateAccountArgs = LoginArgs & {
    passwordConfirmation: string,
};

type DidCreateAccount = {
    readonly didCreateAccount: boolean,
    readonly message: string,
};


export class CreateAccount extends LoginComponent {
    
    private readonly username: InputRef = InputRef.new();
    private readonly password: InputRef = InputRef.new();
    private readonly passwordConfirmation: InputRef = InputRef.new();
    private readonly email: InputRef = InputRef.new();
    private readonly phone: InputRef = InputRef.new();
    
    public constructor(props: LoginProps) {
        super(props, "Create Account");
    }
    
    protected inputsArgs(): InputsArgs {
        return [
            [this.username, "text", "Username"],
            [this.password, "password", "Password"],
            [this.passwordConfirmation, "password", "Confirm Password"],
            [this.email, "email", "Email"],
            [this.phone, "tel", "Phone"],
        ];
    }
    
    protected async doLogin(): Promise<IsLoggedIn> {
        const username: string = this.username();
        const password: string = this.password();
        const response: DidCreateAccount = await fetchJson<CreateAccountArgs, DidCreateAccount>("/createAccount", {
            username: username,
            password: password,
            passwordConfirmation: this.passwordConfirmation(),
        }, {
            cache: "reload",
        });
        if (response.didCreateAccount) {
            return await loginUser(username, password);
        } else {
            return {
                isLoggedIn: false,
                message: response.message,
            };
        }
    }
    
}