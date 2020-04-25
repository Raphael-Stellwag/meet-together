import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IEvent } from '../interfaces/ievent';
import { IMessage } from '../interfaces/imessage';
import { AuthService } from './auth.service';
import { deserialize } from 'v8';
import { EventService } from './event.service';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  messages: IMessage[] = [];
  event_id = null;

  constructor(private socketService: SocketService, private httpClient: HttpClient, private authService: AuthService, private eventService: EventService) {
    this.socketService.newMessageReceived()
      .subscribe(data => {
        let message: IMessage = this.deserializeMessage(data)
        if (message.event_id == this.event_id) {
          this.messages.push(message)
          socketService.readReceivedMessage(this.event_id, message.id)
        } else {
          this.eventService.increaseUnreadMessagesCount(message.event_id);
        }
      });
  }

  getMessages(eventId): Promise<IMessage[]> {
    this.event_id = eventId;
    return new Promise<IMessage[]>((resolve, reject) => {
      this.httpClient.get(environment.api_base_uri + "v1/event/" + eventId + "/messages").subscribe(
        (data: IMessage[]) => {
          console.log("GET Request is successful ", data);
          this.messages.splice(0, this.messages.length);
          data.forEach((element) => {
            this.messages.push(this.deserializeMessage(element));
          });
          //this.socketService.subscribeNewMessage(eventId);
          resolve(this.messages);
        },
        (error: HttpErrorResponse) => {
          console.log("Error", error);
          this.authService.checkErrorAndCreateToken(error.status)
            .then(() => {
              this.getMessages(eventId)
                .then((data) => resolve(data))
                .catch((err) => console.log(err))
            })
            .catch(() => {
              reject(error);
            })
        });
    });
  }

  deserializeMessage(message: IMessage) {
    if (message.time != null)
      message.time = new Date(message.time);
    return message;
  }

  destroy() {
    this.event_id = null;
    //this.socketService.unsubcribeNewMessage(event_id);
  }

}
