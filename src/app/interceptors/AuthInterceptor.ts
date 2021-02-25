import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { StorageService } from '../services/storage.service';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    createTokenUrl = environment.api_base_uri + "v1/token/create";
    verifyTokenUrl = environment.api_base_uri + "v1/token/verify";
    createUserUrl = environment.api_base_uri + "v1/user/";

    constructor(private storage: StorageService, private httpClient: HttpClient) { }

    intercept(req: HttpRequest<any>,
        next: HttpHandler): Observable<HttpEvent<any>> {

        let url = req.url;
        if (url == this.createTokenUrl) {
            return next.handle(this.addBasicAuthorizationHeader(req));
        } else if (url == this.verifyTokenUrl) {
            return next.handle(this.addAccessTokenAuthorizationHeader(req));
        } else if (url == this.createUserUrl) {
            return next.handle(req);
        }

        const idToken = this.storage.getAccessToken();

        if (idToken == null) {
            console.error(url, "Secured url was called before the user was initilized, please fix this")
            return next.handle(this.addAccessTokenAuthorizationHeader(req));
        } else {
            return next.handle(this.addAccessTokenAuthorizationHeader(req));
        }
    }

    addBasicAuthorizationHeader(req: HttpRequest<any>) {
        let user = this.storage.loadUserCredentialsWithPassword();
        const cloned = req.clone({
            headers: req.headers.set("Authorization",
                "Basic " + window.btoa(user.id + ":" + user.password))
        });
        return cloned;
    }

    addAccessTokenAuthorizationHeader(req: HttpRequest<any>) {
        let idToken = this.storage.getAccessToken();
        if (idToken == null)
            idToken = "";
        const cloned = req.clone({
            headers: req.headers.set("Authorization",
                "Bearer " + idToken)
        });
        return cloned;
    }

}