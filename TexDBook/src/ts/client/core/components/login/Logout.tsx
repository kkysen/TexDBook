import * as React from "react";
import {InputsArgs} from "../../../util/components/Inputs";
import {named} from "../../../../share/util/decorators/named";
import {api} from "../../api";
import {IsLoggedIn} from "../../TexDBook";
import {LoginComponent, LoginProps,} from "./LoginComponent";

@named("Logout")
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