import * as React from "react";
import {InputsArgs} from "../../util/components/Inputs";
import {fetchJson} from "../../util/fetch/fetchJson";
import {IsLoggedIn, LoginComponent, LoginProps} from "./LoginComponent";


export class Logout extends LoginComponent {
    
    public constructor(props: LoginProps) {
        super(props, "Logout");
    }
    
    protected inputsArgs(): InputsArgs {
        return [];
    }
    
    protected async doLogin(): Promise<IsLoggedIn> {
        return await fetchJson("/logout", undefined, {
            cache: "reload",
        });
    }
    
}