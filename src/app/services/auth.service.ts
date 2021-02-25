import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { StorageService } from './storage.service';
import { environment } from 'src/environments/environment';
import { IUser } from '../interfaces/iuser';
import { map, delay } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  createTokenUrl = environment.api_base_uri + "v1/token/create";
  verifyTokenUrl = environment.api_base_uri + "v1/token/verify";

  constructor(private httpClient: HttpClient, private storage: StorageService) { }

  async verifyToken(): Promise<any> {
    try {
      let result = await this.httpClient.get(this.verifyTokenUrl).toPromise();
      console.debug("Token verified");
      return true;
    } catch (error) {
      await this.createToken();
      return true;
    }
  }

  async checkErrorAndCreateToken(statuscode) {
      if (statuscode == 403 || statuscode == 401) {
        await this.createToken();
        return true;
      }
      throw new Error("Was not 401 or 403 error")
  }

  async createToken(): Promise<any> {
    let result: any = await this.httpClient.get(this.createTokenUrl).toPromise();

    console.debug("GET Request is successful ", result);
    this.storage.setAccessToken(result.token);
    return (true);
  }

  isLoggedIn(): boolean {
    let user: IUser = this.storage.loadUserCredentials();
    if (user.id != null)
      return true;
    return false;
  }
}
