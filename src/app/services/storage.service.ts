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
    var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!§$%&/()=?{[]}*+-.:;,_#",
      retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }

  getAccessToken() {
    let accesstoken = this.secure_storage.get("access_token");
    if (accesstoken == "")
      return null;
    return accesstoken;
  }

  removeAccessToken() {
    this.secure_storage.remove("access_token");
  }

  setAccessToken(access_token: any) {
    this.secure_storage.set("access_token", access_token);
  }
}
