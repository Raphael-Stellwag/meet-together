import { Injectable } from '@angular/core';
import { IEvent } from '../interfaces/ievent';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { HelperFunctionsService } from './helper-functions.service';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  events: IEvent[] = [];
  isInitializing: boolean = false;
  initializingNotifiers = [];

  constructor(private socketService: SocketService, private userService: UserService, private httpClient: HttpClient, private authService: AuthService, private helperFunctions: HelperFunctionsService) {
    let _this = this;

    socketService.eventGotChanged().subscribe(
      (changed_event: IEvent) => {
        changed_event = _this.helperFunctions.jsonDateToJsDate(changed_event);

        let found_event = _this.events.find((event) => event.id == changed_event.id);
        found_event.accesstoken = changed_event.accesstoken;
        found_event.description = changed_event.description;
        found_event.end_date = changed_event.end_date;
        found_event.name = changed_event.name;
        found_event.place = changed_event.place;
        found_event.link = changed_event.link;
        found_event.start_date = changed_event.start_date
      });

  }

  async getEvents(): Promise<IEvent[]> {
    this.isInitializing = true;
    if (this.userService.getUserId() != null) {
      let data: IEvent[] = (await this.httpClient.get(environment.api_base_uri + "v1/user/" +
                                          this.userService.getUserId() + "/event").toPromise()) as IEvent[];

      console.debug("GET Request is successful ", data);
      this.events.splice(0, this.events.length);
      data.forEach((element) => {
        element.count_unread_messages = Number(element.count_unread_messages);
        this.events.push(this.helperFunctions.jsonDateToJsDate(element));
      });
      this.initializingNotifiers.forEach((notifier) => {
        notifier();
      })
      this.initializingNotifiers = [];
      return this.events;
    }
  }

  async getEvent(event_id: any): Promise<IEvent> {
    // Is the service already initialized?
    if (this.events.length == 0) {
      if (this.isInitializing) {
        await new Promise((resolve) => {
          this.initializingNotifiers.push(resolve);
        });
      } else {
        await this.getEvents();
      }
    }
    return this.internalGetEvent(event_id);

  }

  private internalGetEvent(event_id): IEvent {
    let ret_event = null;
    this.events.forEach((event: IEvent) => {
      if (event.id == event_id) {
        ret_event = event;
      }
    });
    return ret_event;
  }

  async addEvent(event: IEvent): Promise<IEvent> {
    let json = this.helperFunctions.ObjectToJSON(event);
    let data = await this.httpClient.post(environment.api_base_uri + "v1/user/" + this.userService.getUserId() + "/event", json,
                          { headers: this.helperFunctions.getHttpHeaders() }).toPromise();

    console.debug("POST Request is successful ", data);

    let serverEvent = this.helperFunctions.jsonDateToJsDate(data)
    serverEvent.count_unread_messages = Number(serverEvent.count_unread_messages);
    this.events.push(serverEvent);

    return serverEvent;
  }

  async updateEvent(event: IEvent): Promise<IEvent> {
    let json = this.helperFunctions.ObjectToJSON(event);

    let data: IEvent = (await this.httpClient.put(environment.api_base_uri + "v1/user/" + this.userService.getUserId() + "/event/" + event.id, json,
                              { headers: this.helperFunctions.getHttpHeaders() }).toPromise()) as IEvent;

    data = this.helperFunctions.jsonDateToJsDate(data);
    console.debug("PUT Request is successful ", data);

    let localEvent = this.events.find((e) => e.id == data.id);
    localEvent.accesstoken = data.accesstoken;
    localEvent.description = data.description;
    localEvent.end_date = data.end_date;
    localEvent.name = data.name;
    localEvent.place = data.place;
    localEvent.link = data.link;
    localEvent.start_date = data.start_date
    localEvent.count_unread_messages = Number(data.count_unread_messages);
    localEvent.last_read_message = data.last_read_message;

    return localEvent;
  }

  async joinEvent(event_id: any, access_token: any): Promise<IEvent> {

    let event: IEvent = await this.httpClient.put(environment.api_base_uri + "v1/event/" + event_id + "/user/" + this.userService.getUserId() + "?accesstoken=" + access_token,
                                {}).toPromise() as IEvent;
    console.debug("PUT Request is successful ", event);
    event = this.helperFunctions.jsonDateToJsDate(event);
    event.count_unread_messages = Number(event.count_unread_messages);

    this.events.push(event);
    return event;

  }

  async leaveEvent(event_id) {
    let data = await this.httpClient.delete(environment.api_base_uri + "v1/event/" + event_id + "/user/" + this.userService.getUserId(), {}).toPromise();

    console.debug("DELETE Request is successful ", data);
    this.events = this.events.filter((event) => event.id != event_id);
  }

  increaseUnreadMessagesCount(event_id: number) {
    let foundElement = this.events.find((event) => event.id == event_id);
    foundElement.count_unread_messages++;
    foundElement.last_message_time = new Date();
  }

  logout() {
    this.events = [];
    this.socketService.logout();
  }
}
