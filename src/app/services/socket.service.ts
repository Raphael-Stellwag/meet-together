import { Injectable, OnDestroy } from '@angular/core';
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
export class SocketService implements OnDestroy {
  socket;
  initialized = false;
  resolve: (() => void)[] = [];

  constructor(private authService: AuthService, private storageService: StorageService) {
    this.initializeSocket();
  }

  newMessageReceived() {
    let observable = new Observable<IMessage>(observer => {
      let promise = new Promise(resolve => {
        if (this.initialized) {
          resolve();
        } else {
          //Socket connection not established yet (because its async) => will resolve it when established
          this.resolve.push(resolve);
        }
      })

      promise.then(() => {
        console.debug(this.socket);
        this.socket.on('new_message', (data) => {
          console.debug(data);
          observer.next(data);
        });
        return () => { this.socket.disconnect(); }
      })

    });

    return observable;
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
      this.socket.emit("subscribe_event", event_id);
      this.socket.emit('subscribe_new_message', event_id)
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
        console.debug(this.socket);
        this.socket.on('event_update', (data) => {
          console.debug(data);
          observer.next(data);
        });
        return () => { this.socket.disconnect(); }
      })
    });
    return observable;
  }

  unsubscribeEvent(event_id: IEvent) {
    this.socket.emit("unsubscribe_event", event_id);
    this.socket.emit("unsubscribe_new_message", event_id);

  }

  readReceivedMessage(event_id, message_id) {
    let received_details = {
      event_id: event_id,
      user_id: this.storageService.loadUserCredentials().id,
      message_id: message_id,
    }
    this.socket.emit("read_received_message", received_details);
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
      console.log("Socket initilized")
    }).catch(err => console.error(err))
  }

  logout() {
    this.socket.close();
    this.socket = null;
  }


  ngOnDestroy() {
    this.socket.close();
  }
}
