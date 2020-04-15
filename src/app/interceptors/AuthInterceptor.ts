import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    createTokenUrl = "localhost:9000/v1/token/create";
    verifyTokenUrl = "localhost:9000/v1/token/verify";
    createUserUrl = "localhost:9000/v1/user/";

    constructor(private storage: StorageService, private httpClient: HttpClient) { }

    intercept(req: HttpRequest<any>,
        next: HttpHandler): Observable<HttpEvent<any>> {

        let url = req.url.substring(req.url.indexOf("://") + 3, req.url.length);
        if (url == this.createTokenUrl) {
            return next.handle(this.addBasicAuthorizationHeader(req));
        } else if (url == this.verifyTokenUrl) {
            return next.handle(this.addAccessTokenAuthorizationHeader(req));
        } else if (url == this.createUserUrl) {
            return next.handle(req);
        }

        const idToken = this.storage.getAccessToken();
        if (idToken == null) {
            return next.handle(this.addAccessTokenAuthorizationHeader(req));
        } else {
            return next.handle(this.addAccessTokenAuthorizationHeader(req));
        }
    }

    addBasicAuthorizationHeader(req: HttpRequest<any>) {
        let user = this.storage.loadUserCredentialsWithPassword();
        const cloned = req.clone({
            headers: req.headers.set("Authorization",
                "Basic " + window.btoa(user.id + " " + user.password))
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