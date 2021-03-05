import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IMessage } from '../interfaces/imessage';
import { AuthService } from './auth.service';
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

  async getMessages(eventId): Promise<IMessage[]> {
    this.event_id = eventId;
    let data: IMessage[] =  (await this.httpClient.get(environment.api_base_uri +
                                      "v1/event/" + eventId + "/messages").toPromise()) as IMessage[];

    console.debug("GET Request is successful ", data);
    this.messages.splice(0, this.messages.length);
    data.forEach((element) => {
      this.messages.push(this.deserializeMessage(element));
    });
    return this.messages;
  }

  async sendMessage(event_id: any, content: any) {
    let messageObj: IMessage = {
      content: content
    }
    let message: IMessage = (await this.httpClient.post(environment.api_base_uri + "v1/event/" + event_id +
      "/user/" + this.userService.getUserId() + "/message", messageObj).toPromise()) as IMessage;

    console.debug("POST Request is successful ", message);
    message = this.deserializeMessage(message);
    this.newMessageWithCorrospondingEventId(message);
    return message;
  }

  private newMessageWithCorrospondingEventId(newMessage: IMessage) {
    // Check if the message was send from this client then it is probably already added
    let foundLocalMessage = this.messages.find((msg) => msg.id == newMessage.id);
    if (foundLocalMessage == undefined) {
      this.messages.push(newMessage)
      this.socketService.readReceivedMessage(this.event_id, newMessage.id)
    }
  }

  destroy() {
    this.event_id = null;
  }

  logout() {
    this.event_id = null;
    this.messages = [];
  }

  private deserializeMessage(message: IMessage) {
    if (message.time != null)
      message.time = new Date(message.time);
    return message;
  }

}
