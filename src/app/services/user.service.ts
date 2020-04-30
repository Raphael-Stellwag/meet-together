import { Injectable } from '@angular/core';
import { rejects } from 'assert';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { IUser } from '../interfaces/iuser';
import { StorageService } from './storage.service';
import { environment } from 'src/environments/environment';
import { SocketService } from './socket.service';
import { AuthService } from './auth.service';
import { HelperFunctionsService } from './helper-functions.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: IUser;

  constructor(private helperFunctions: HelperFunctionsService, private httpClient: HttpClient, private storageService: StorageService, private socketService: SocketService, private authService: AuthService) {
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

  logout() {
    this.user = null;
    this.storageService.logout();
  }

  renameUser(username: String) {
    let _this = this;
    return new Promise((resolve, reject) => {
      var body: IUser = {
        name: username
      }
      this.httpClient.put(environment.api_base_uri + "v1/user/" + this.user.id + "/rename", body, { headers: this.helperFunctions.getHttpHeaders() }).subscribe(
        (data: IUser) => {
          console.debug("POST Request is successful ", data);
          let fullUser: IUser = _this.storageService.loadUserCredentialsWithPassword();
          fullUser.name = data.name;
          _this.storageService.saveUserCredentials(fullUser);
          _this.user.name = username;
          resolve();
        },
        error => {
          console.warn("Error", error);
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
        registered: false
      }
      this.httpClient.post(environment.api_base_uri + "v1/user/", body, { headers: this.helperFunctions.getHttpHeaders() }).subscribe(
        (data: IUser) => {
          console.debug("POST Request is successful ", data);

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
          console.warn("Error", error);
          reject(error);
        });
    });
  }

  loginUser(email: string, password: string) {
    let _this = this;
    return new Promise((resolve, reject) => {
      var body: IUser = {
        email: email,
        password: password,
      }

      this.httpClient.put(environment.api_base_uri + "v1/user/login", body, { headers: this.helperFunctions.getHttpHeaders() }).subscribe(
        (data: IUser) => {
          console.debug("PUT Request is successful ", data);
          _this.user = data;
          body.id = data.id;
          body.name = data.name;
          body.registered = data.registered;
          _this.storageService.saveUserCredentials(body);
          resolve(_this.user);
        },
        (error: HttpErrorResponse) => {
          console.warn("Error", error);
          if (error.status == 403) {
            //Token not anymore valid --> create new token and try again
            _this.authService.checkErrorAndCreateToken(error.status)
              .then(() => {
                _this.loginUser(email, password)
                  .then((data) => resolve(data))
                  .catch((err) => reject(err))
              })
              .catch(() => {
                console.warn(error);
                reject(error);
              })
          } else {
            reject(error);
          }
        });
    });
  }

  registerUser(name: string, email: string, password: string) {
    let _this = this;
    return new Promise((resolve, reject) => {
      var body: IUser = {
        name: name,
        email: email,
        password: password,
        registered: true
      }
      this.httpClient.put(environment.api_base_uri + "v1/user/" + this.user.id + "/register", body, { headers: this.helperFunctions.getHttpHeaders() }).subscribe(
        (data: IUser) => {
          console.debug("PUT Request is successful ", data);
          _this.user.name = data.name;
          _this.user.email = data.email;
          _this.user.registered = data.registered;
          body.id = data.id;
          _this.storageService.saveUserCredentials(body);
          resolve(_this.user);
        },
        (error: HttpErrorResponse) => {
          console.warn("Error", error);
          if (error.status == 403) {
            //Token not anymore valid --> create new token and try again
            _this.authService.checkErrorAndCreateToken(error.status)
              .then(() => {
                _this.registerUser(name, email, password)
                  .then((data) => resolve(data))
                  .catch((err) => reject(err))
              })
              .catch(() => {
                reject(error);
              })
          } else {
            //For example email already registered
            reject(error);
          }
        });
    });
  }
}
