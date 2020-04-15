import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  createTokenUrl = "localhost:9000/v1/token/create";
  verifyTokenUrl = "localhost:9000/v1/token/verify";

  constructor(private httpClient: HttpClient, private storage: StorageService) { }

  verifyToken(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpClient.get("http://" + this.verifyTokenUrl).subscribe(
        (data) => {
          console.log("Token verified");
          resolve();
        },
        error => {
          console.log("Error", error);
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
      this.httpClient.get("http://" + this.createTokenUrl).subscribe(
        (data: any) => {
          console.log("GET Request is successful ", data);
          this.storage.setAccessToken(data.token);
          resolve();
        },
        error => {
          console.log("Error", error);
          reject(error);
        });
    })
  }
}
