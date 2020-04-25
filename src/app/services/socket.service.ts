import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import { Observable } from 'rxjs';
import { IMessage } from '../interfaces/imessage';
import { AuthService } from './auth.service';
import { AuthGuard } from '../guards/auth.guard';
import { StorageService } from './storage.service';
import { IEvent } from '../interfaces/ievent';
import { UserService } from './user.service';
import { rejects } from 'assert';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket;
  initialized = false;
  resolve: (() => void)[] = [];

  constructor(private authService: AuthService, private storageService: StorageService) {
    this.initializeSocket();
  }

  subscribeNewMessage(event_id) {
    let promise = new Promise(resolve => {
      if (this.initialized) {
        resolve();
      } else {
        //Socket connection not established yet (because its async) => will resolve it when establish
        this.resolve.push(resolve);
      }
    })

    promise.then(() => {
      this.socket.emit('subscribe_new_message', event_id)
    })
  }

  newMessageReceived() {
    let observable = new Observable<IMessage>(observer => {
      let promise = new Promise(resolve => {
        if (this.initialized) {
          resolve();
        } else {
          //Socket connection not established yet (because its async) => will resolve it when establish
          this.resolve.push(resolve);
        }
      })

      promise.then(() => {
        console.log(this.socket);
        this.socket.on('new_message', (data) => {
          console.log(data);
          observer.next(data);
        });
        return () => { this.socket.disconnect(); }
      })

    });

    return observable;
  }

  unsubcribeNewMessage(event_id) {
    this.socket.emit("unsubscribe_new_message", event_id);
    this.socket.off("unsubscribe_new_message");
    //Resets the callback For new message, otherwise it will be called multiple times
    //this.socket._callbacks.$new_message = [];
  }

  subscribeEvent(event_id) {
    let promise = new Promise(resolve => {
      if (this.initialized) {
        resolve();
      } else {
        //Socket connection not established yet (because its async) => will resolve it when establish
        this.resolve.push(resolve);
      }
    })

    promise.then(() => {
      console.log(event_id);
      this.socket.emit("subscribe_event", event_id);
    })
  }

  eventGotChanged() {
    let observable = new Observable<IEvent>(observer => {
      let promise = new Promise(resolve => {
        if (this.initialized) {
          resolve();
        } else {
          //Socket connection not established yet (because its async) => will resolve it when establish
          this.resolve.push(resolve);
        }
      })

      promise.then(() => {
        console.log(this.socket);
        this.socket.on('event_update', (data) => {
          console.log(data);
          observer.next(data);
        });
        return () => { this.socket.disconnect(); }
      })
    });
    return observable;
  }

  unsubscribeEvent(event_id: IEvent) {
    this.socket.emit("unsubscribe_event", event_id);

  }

  initializeSocket() {
    let promise = new Promise((resolve, reject) => {
      if (this.authService.isLoggedIn()) {
        this.authService.verifyToken()
          .then(() => resolve())
          .catch(() => {
            this.authService.createToken()
              .then(() => resolve())
          })
      } else {
        reject("Socket service was not initialized, user not logged in");
      }
    })

    promise.then(() => {
      let token = this.storageService.getAccessToken();
      this.socket = io(/*"https://test-ddnss.ddnss.de"*/environment.api_base_uri, { query: 'auth_token=' + token });

      this.initialized = true;
      this.resolve.forEach(res => res());
      console.log("initialized")
    }).catch(err => console.log(err))
  }

}
