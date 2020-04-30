import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { StorageService } from './storage.service';
import { environment } from 'src/environments/environment';
import { IUser } from '../interfaces/iuser';
import { resolve } from 'dns';
import { rejects } from 'assert';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  createTokenUrl = environment.api_base_uri + "v1/token/create";
  verifyTokenUrl = environment.api_base_uri + "v1/token/verify";

  constructor(private httpClient: HttpClient, private storage: StorageService) { }

  verifyToken(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.verifyTokenUrl).subscribe(
        () => {
          console.debug("Token verified");
          resolve();
        },
        error => {
          console.error("Error", error);
          this.createToken().then(() => resolve()).catch(() => reject());
        });
    })
  }

  checkErrorAndCreateToken(statuscode) {
    return new Promise((resolve, reject) => {
      if (statuscode == 403) {
        this.createToken()
          .then(() => {
            resolve();
          })
          .catch(() => {
            reject();
          })
      } else {
        reject();
      }
    })
  }

  createToken(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClient.get(this.createTokenUrl).subscribe(
        (data: any) => {
          console.debug("GET Request is successful ", data);
          this.storage.setAccessToken(data.token);
          resolve(true);
        },
        error => {
          console.error("Error", error);
          reject(error);
        });
    })
  }

  isLoggedIn(): boolean {
    let user: IUser = this.storage.loadUserCredentials();
    if (user.id != null)
      return true;
    return false;
  }
}
