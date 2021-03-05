import {Injectable, OnDestroy} from '@angular/core';
import {Observable, Subscriber} from 'rxjs';
import {IMessage} from '../interfaces/imessage';
import {AuthService} from './auth.service';
import {StorageService} from './storage.service';
import {IEvent} from '../interfaces/ievent';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService implements OnDestroy {
  socket: WebSocket;
  initialized = false;
  resolve: (() => void)[] = [];
  eventGotChangedObserver: Subscriber<IEvent>;
  newMessageReceivedObserver: Subscriber<IMessage>;
  _this;

  constructor(private authService: AuthService, private storageService: StorageService) {
    this._this = this;
    this.initializeSocket();
  }

  newMessageReceived() {
    return new Observable<IMessage>(observer => {
      this.newMessageReceivedObserver = observer;
    });
  }

  eventGotChanged() {
    return new Observable<IEvent>(observer => {
      this.eventGotChangedObserver = observer;
    });
  }

  readReceivedMessage(event_id, message_id) {

    let received_details = {
      event_id: event_id,
      user_id: this.storageService.loadUserCredentials().id,
      message_id: message_id,
    }
    let customObj = {
      method: "READ_RECEIVED_DATA",
      additional_data: received_details
    }
    this.socket.send(JSON.stringify(customObj));

  }

  initializeSocket() {
    let _this = this;
    let promise = new Promise((resolve, reject) => {
      if (this.authService.isLoggedIn()) {
        this.authService.verifyToken()
          .then(() => resolve(null))
          .catch(() => {
            this.authService.createToken()
              .then(() => resolve(null))
          })
      } else {
        reject("Socket service was not initialized, user not logged in");
      }
    })

    promise.then(() => {
      let token = this.storageService.getAccessToken();

      let socket = new WebSocket(environment.ws_base_uri);
      this.socket = socket;

      this.socket.onopen = function(e) {
        let custumObj = {
          token: token.token,
          method: "AUTHENTICATE"
        }
        socket.send(JSON.stringify(custumObj));
      }

      this.socket.onmessage = function(event:any) {
        _this.onMessage(event, _this)
      }

      console.log("Socket initilized")
    }).catch(err => console.error(err))

  }

  private onMessage(event: any, _this: any) {
    console.debug("WebSocket message received:", event);

    let data = JSON.parse(event.data);
    console.log(data);

    if (data.method == "NEW_MESSAGE") {
      _this.newMessageReceivedObserver.next(JSON.parse(data.additional_data));
    } else if (data.method == "EVENT_UPDATE") {
      _this.eventGotChangedObserver.next(JSON.parse(data.additional_data));
    } else {
      console.log("Websocket message received with Content OK");
    }
  }

  logout() {
    this.socket.close();
    this.socket = null;
  }

  ngOnDestroy() {
    this.socket.close();
  }
}
