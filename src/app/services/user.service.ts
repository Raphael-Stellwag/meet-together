import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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

  async renameUser(username: string) {
    var body: IUser = {
      name: username
    }
    let data = await this.httpClient.put(environment.api_base_uri + "v1/rename", body).toPromise();
                       
    console.debug("POST Request is successful ", data);
    let storageUser: IUser = this.storageService.loadUserCredentialsWithPassword();
    storageUser.name = (data as IUser).name;
    this.storageService.saveUserCredentials(storageUser);
    this.user.name = username;
  }

  /**
   * This creates a new user in the backend. The user is not logged in.
   * @param username User choose this name 
   */
  async createUserName(username: string) {
    var body: IUser = {
      name: username,
      password: this.storageService.generateRandomString(20),
      registered: false
    }

    let data: IUser = await this.httpClient.post(environment.api_base_uri + "v1/user/", body).toPromise();
    
    console.debug("POST Request is successful ", data);

    this.user = data;
    body.id = data.id;
    this.storageService.saveUserCredentials(body);

    await this.authService.createToken()
    this.socketService.initializeSocket();
    
    return this.user;
  }

  async loginUser(email: string, password: string) {
    var body: IUser = {
      email: email,
      password: password,
    }

    let data: IUser;
    try {
      data = await this.httpClient.put(environment.api_base_uri + "v1/user/login", body).toPromise();
    } catch (error: any) {
      console.warn("Error", error);
      if (error.status == 403) {
        //Token not anymore valid --> create new token and try again
        try {
          await this.authService.checkErrorAndCreateToken(error.status);
          data = await this.httpClient.put(environment.api_base_uri + "v1/user/login", body).toPromise();

        } catch (innerError) {
          // Not possible to create a new Token
          console.warn(innerError);
          throw error;
        }
      } else {
        throw error;
      }
    }
        
    console.debug("PUT Request is successful ", data);
    this.user = data;
    body.id = data.id;
    body.name = data.name;
    body.registered = data.registered;
    this.storageService.saveUserCredentials(body);
    this.storageService.removeAccessToken();
    return this.user;
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
      this.httpClient.put(environment.api_base_uri + "v1/register", body, { headers: this.helperFunctions.getHttpHeaders() }).subscribe(
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
