import { Injectable } from '@angular/core';
import { rejects } from 'assert';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private username: String = null;
  private id: Number = null;


  constructor() {
    this.setUserCredentials();
  }

  getUserName() {
    return this.username;
  }

  getUserId() {
    return this.id;
  }

  createUserName(username: string) {
    return new Promise((resolve, reject) => {
      this.username = username;
      resolve();
      //TODO POST TO SERVER
    })

  }

  setUserCredentials() {
    //TODO Load credentials from cache
  }

}
