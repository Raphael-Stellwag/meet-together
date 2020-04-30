import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IEvent } from '../interfaces/ievent';
import { IMessage } from '../interfaces/imessage';
import { AuthService } from './auth.service';
import { deserialize } from 'v8';
import { EventService } from './event.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  messages: IMessage[] = [];
  event_id = null;

  constructor(private socketService: SocketService, private httpClient: HttpClient, private authService: AuthService, private eventService: EventService, private userService: UserService) {
    this.socketService.newMessageReceived()
      .subscribe(data => {
        let message: IMessage = this.deserializeMessage(data)
        if (message.event_id == this.event_id) {
          this.newMessageWithCorrospondingEventId(message);
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
          console.debug("GET Request is successful ", data);
          this.messages.splice(0, this.messages.length);
          data.forEach((element) => {
            this.messages.push(this.deserializeMessage(element));
          });
          resolve(this.messages);
        },
        (error: HttpErrorResponse) => {
          console.warn("Error", error);
          this.authService.checkErrorAndCreateToken(error.status)
            .then(() => {
              this.getMessages(eventId)
                .then((data) => resolve(data))
                .catch((err) => console.error(err))
            })
            .catch(() => {
              reject(error);
            })
        });
    });
  }

  private newMessageWithCorrospondingEventId(newMessage: IMessage) {
    // Check if the message was send from this client then it is probably already added
    let foundLocalMessage = this.messages.find((msg) => msg.id == newMessage.id);
    if (foundLocalMessage == undefined || foundLocalMessage == null) {
      this.messages.push(newMessage)
      this.socketService.readReceivedMessage(this.event_id, newMessage.id)
    }
  }

  sendMessage(event_id: any, content: any) {
    return new Promise<IMessage>((resolve, reject) => {
      let messageObj: IMessage = {
        content: content
      }
      this.httpClient.post(environment.api_base_uri + "v1/event/" + event_id + "/user/" + this.userService.getUserId() + "/message", messageObj).subscribe(
        (message: IMessage) => {
          console.debug("POST Request is successful ", message);
          message = this.deserializeMessage(message);
          this.newMessageWithCorrospondingEventId(message)
          resolve(message);
        },
        (error: HttpErrorResponse) => {
          console.warn("Error", error);
          this.authService.checkErrorAndCreateToken(error.status)
            .then(() => {
              this.sendMessage(event_id, content)
                .then((data) => resolve(data))
                .catch((err) => console.error(err))
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
  }

  logout() {
    this.event_id = null;
    this.messages = [];
  }

}
