import { IToken } from './../interfaces/itoken';
import { Injectable } from '@angular/core';
import { IUser } from '../interfaces/iuser';
import * as SecureLS from 'secure-ls';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private secure_storage: SecureLS;

  constructor() {
    this.secure_storage = new SecureLS({
      encodingType: "aes"
    });
  }

  logout() {
    this.secure_storage.removeAll();
  }

  saveUserCredentials(user: IUser) {
    let secret = this.generateRandomString(30);
    let cipherUser = CryptoJS.AES.encrypt(JSON.stringify(user), secret).toString();
    this.secure_storage.set("secret", secret);
    this.secure_storage.set("user", cipherUser);
  }

  loadUserCredentials() {
    let userWithPwd: IUser = this.loadUserCredentialsWithPassword();
    let user: IUser = {
      id: userWithPwd.id,
      name: userWithPwd.name,
      registered: userWithPwd.registered
    }
    return user;
  }

  loadUserCredentialsWithPassword(): IUser {
    if (this.secure_storage.getAllKeys().includes("user") == false) {
      return { name: null, id: null, registered: null };
    }
    let cipherUser = this.secure_storage.get("user");
    let secret = this.secure_storage.get("secret");
    var bytes = CryptoJS.AES.decrypt(cipherUser, secret);
    var decryptedUser: IUser = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedUser;
  }

  generateRandomString(length: number) {
    let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }

  getAccessToken(): IToken {
    let accesstoken: any = this.secure_storage.get("access_token");
    if (accesstoken == "" || accesstoken == null)
      return null;
    
    (accesstoken as IToken).expiration_date = new Date(Date.parse(accesstoken.expiration_date));
    return accesstoken as IToken;
  }

  removeAccessToken() {
    this.secure_storage.remove("access_token");
  }

  setAccessToken(access_token: IToken) {
    this.secure_storage.set("access_token", access_token);
  }

  getLastBackendCall(): Date {
    let timestamp = this.secure_storage.get("last_backend_call");
    if (Number.isInteger(timestamp)) {
      let date = new Date();
      date.setTime(timestamp);
      return date;
    }
    return null;
  }

  setLastBackendCall(last_backend_call: Date) {
    this.secure_storage.set("last_backend_call", last_backend_call.getTime());
  }
}
