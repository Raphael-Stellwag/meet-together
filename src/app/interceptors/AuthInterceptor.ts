import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    readonly createTokenUrl = environment.api_base_uri + "v1/token/create";
    readonly createUserUrl = environment.api_base_uri + "v1/user/";
    readonly pingUrl = environment.api_base_uri + "v1/ping";

    constructor(private storage: StorageService, private httpClient: HttpClient, private auth: AuthService) { }

    intercept(req: HttpRequest<any>,
        next: HttpHandler): Observable<HttpEvent<any>> {

        let url = req.url;
        if (url == this.createTokenUrl) {
            return next.handle(this.addBasicAuthorizationHeader(req));
        } else if (url == this.createUserUrl || url == this.pingUrl) {
            return next.handle(req);
        }

        return from(this.addAccessTokenAuthorizationHeaderAndContinueRequest(req, next));

    }

    addBasicAuthorizationHeader(req: HttpRequest<any>) {
        let user = this.storage.loadUserCredentialsWithPassword();
        const cloned = req.clone({
            headers: req.headers.set("Authorization",
                "Basic " + window.btoa(user.id + ":" + user.password))
        });
        return cloned;
    }

    async addAccessTokenAuthorizationHeaderAndContinueRequest(req: HttpRequest<any>,
        next: HttpHandler): Promise<HttpEvent<any>> {
        
        let idToken = this.storage.getAccessToken();
        let clonedRequest;

        //Is the token already expired or will do so soon
        if (idToken == null || Date.now() > (idToken.expiration_date.getTime() - 5000)) {
            let newToken = await this.auth.createToken();
            clonedRequest = req.clone({
                headers: req.headers.set("Authorization",
                    "Bearer " + newToken.token)
            });
        } else {
            clonedRequest = req.clone({
                headers: req.headers.set("Authorization",
                    "Bearer " + idToken.token)
            });
        }

        return next.handle(clonedRequest).toPromise();
    }

}