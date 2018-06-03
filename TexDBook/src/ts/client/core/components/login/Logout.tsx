import * as React from "react";
import {InputsArgs} from "../../../util/components/Inputs";
import {api} from "../../api";
import {IsLoggedIn, LoginComponent, LoginProps,} from "./LoginComponent";


export class Logout extends LoginComponent {
    
    public constructor(props: LoginProps) {
        super(props, "Logout");
    }
    
    protected inputsArgs(): InputsArgs {
        return [];
    }
    
    protected async doLogin(): Promise<IsLoggedIn> {
        return api.logout();
    }
    
}