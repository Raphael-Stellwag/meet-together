import { Injectable } from '@angular/core';
import { rejects } from 'assert';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../interfaces/iuser';
import { StorageService } from './storage.service';
import { environment } from 'src/environments/environment';
import { SocketService } from './socket.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: IUser;

  constructor(private httpClient: HttpClient, private storageService: StorageService, private socketService: SocketService, private authService: AuthService) {
    this.user = storageService.loadUserCredentials();
  }

  getUserName() {
    return this.user.name;
  }

  getUserId() {
    return this.user.id;
  }

  getUser() {
    return this.user;
  }

  renameUser(username: String) {
    let _this = this;
    return new Promise((resolve, reject) => {
      var body: IUser = {
        name: username
      }
      this.httpClient.put(environment.api_base_uri + "v1/user/" + this.user.id + "/rename", body).subscribe(
        (data: IUser) => {
          console.log("POST Request is successful ", data);
          let fullUser: IUser = _this.storageService.loadUserCredentialsWithPassword();
          fullUser.name = data.name;
          _this.storageService.saveUserCredentials(fullUser);
          _this.user.name = username;
        },
        error => {
          console.log("Error", error);
          reject(error);
        });
    });
  }

  createUserName(username: string) {
    let _this = this;
    return new Promise((resolve, reject) => {
      var body: IUser = {
        name: username,
        password: this.storageService.generateRandomString(20),
        password_generated: true
      }
      this.httpClient.post(environment.api_base_uri + "v1/user/", body).subscribe(
        (data: IUser) => {
          console.log("POST Request is successful ", data);

          _this.user = data;
          body.id = data.id;
          _this.storageService.saveUserCredentials(body);
          this.authService.createToken()
            .then(() => {
              this.socketService.initializeSocket();
              resolve(_this.user);
            })
        },
        error => {
          console.log("Error", error);
          reject(error);
        });
    });
  }
}
