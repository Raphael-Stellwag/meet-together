import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import { Observable } from 'rxjs';
import { IMessage } from '../interfaces/imessage';
import { AuthService } from './auth.service';
import { AuthGuard } from '../guards/auth.guard';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket;
  initialized = false;
  resolve: () => void = null;

  constructor(private authService: AuthService, private storageService: StorageService) {
    this.initializeSocket();
  }

  newMessageReceived(eventId) {
    let observable = new Observable<IMessage>(observer => {
      let promise = new Promise(resolve => {
        if (this.initialized) {
          resolve();
        } else {
          this.resolve = resolve;
        }
      })

      promise.then(() => {
        this.socket.emit('subscribe_new_message', eventId)
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
    this.socket._callbacks.$new_message = [];
  }

  private initializeSocket() {
    let promise = new Promise((resolve) => {
      this.authService.verifyToken()
        .then(() => resolve())
        .catch(() => {
          this.authService.createToken()
            .then(() => resolve())
        })
    })

    promise.then(() => {
      let token = this.storageService.getAccessToken();
      this.socket = io('http://localhost:9000', { query: 'auth_token=' + token });

      this.initialized = true;
      if (this.resolve != null) {
        this.resolve();
      }
      console.log("initialized")
    })
  }

}
