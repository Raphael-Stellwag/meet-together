import { Injectable } from '@angular/core';
import { rejects } from 'assert';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../interfaces/iuser';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: IUser;

  constructor(private httpClient: HttpClient, private storageService: StorageService) {
    this.user = storageService.loadUserCredentials();
  }

  getUserName() {
    return this.user.name;
  }

  getUserId() {
    return this.user.id;
  }

  createUserName(username: string) {
    let _this = this;
    return new Promise((resolve, reject) => {
      var body: IUser = {
        name: username,
        password: this.storageService.generateRandomString(20),
        password_generated: true
      }
      this.httpClient.post("http://localhost:9000/v1/user/", body).subscribe(
        (data: IUser) => {
          console.log("POST Request is successful ", data);

          _this.user = data;
          body.id = data.id;
          _this.storageService.saveUserCredentials(body);
          resolve(_this.user);
        },
        error => {
          console.log("Error", error);
          reject(error);
        });
    });
  }
}
