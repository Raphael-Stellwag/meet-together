import { Injectable } from '@angular/core';
import { IEvent } from '../interfaces/ievent';
import { UserService } from './user.service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { element } from 'protractor';
import { AuthService } from './auth.service';
import { IUser } from '../interfaces/iuser';
import { ITimePlaceSuggestion } from '../interfaces/itime-place-suggestion';
import { environment } from 'src/environments/environment';
import { HelperFunctionsService } from './helper-functions.service';
import { SocketService } from './socket.service';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

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

  getEvents(): Promise<IEvent[]> {
    this.isInitializing = true;
    return new Promise<IEvent[]>((resolve, reject) => {
      if (this.userService.getUserId() != null) {
        this.httpClient.get(environment.api_base_uri + "v1/user/" + this.userService.getUserId() + "/event").subscribe(
          (data: IEvent[]) => {
            console.log("GET Request is successful ", data);
            this.events.splice(0, this.events.length);
            data.forEach((element) => {
              element.count_unread_messages = Number(element.count_unread_messages);
              this.events.push(this.helperFunctions.jsonDateToJsDate(element));
              this.socketService.subscribeEvent(element.id);
            });
            this.initializingNotifiers.forEach((notifier) => {
              notifier(this.events);
            })
            this.initializingNotifiers = [];
            resolve(this.events);
          },
          (error: HttpErrorResponse) => {
            console.log("Error", error);
            this.authService.checkErrorAndCreateToken(error.status)
              .then(() => {
                this.getEvents()
                  .then((data) => resolve(data))
                  .catch((err) => console.log(err))
              })
              .catch(() => {
                reject(error);
              })
          });
      } else {
        reject(this.events);
      }
    });
  }

  getEvent(event_id: any): any {
    return new Promise<IEvent[]>((resolve, reject) => {
      if (this.events.length == 0) {
        if (this.isInitializing) {
          new Promise((inner_resolve) => {
            this.initializingNotifiers.push(inner_resolve);
          }).then(() => resolve(this.internalGetEvent(event_id)));
        } else {
          let _this = this;
          this.getEvents().then((events: IEvent[]) => {
            resolve(_this.internalGetEvent(event_id));
          })
        }
      } else {
        resolve(this.internalGetEvent(event_id));
      }
    })
  }

  private internalGetEvent(event_id) {
    let ret_event = null;
    this.events.forEach((event: IEvent) => {
      if (event.id == event_id) {
        ret_event = event;
      }
    });
    return ret_event;
  }

  addEvent(event: IEvent) {
    let _this = this;
    return new Promise((resolve, reject) => {
      let json = this.helperFunctions.ObjectToJSON(event);
      console.log(json);
      this.httpClient.post(environment.api_base_uri + "v1/user/" + this.userService.getUserId() + "/event", json, { headers: this.helperFunctions.getHttpHeaders() }).subscribe(
        data => {
          console.log("POST Request is successful ", data);
          let event = _this.helperFunctions.jsonDateToJsDate(data)
          event.count_unread_messages = Number(event.count_unread_messages);
          _this.events.push(event);
          this.socketService.subscribeEvent(event.id);

          resolve(event);
        },
        (error: HttpErrorResponse) => {
          console.log("Error", error);
          this.authService.checkErrorAndCreateToken(error.status)
            .then(() => {
              this.addEvent(event)
                .then((data) => resolve(data))
                .catch((err) => reject(error))
            })
            .catch(() => {
              reject(error);
            })
        });
    });
  }

  updateEvent(event: IEvent) {
    let _this = this;
    return new Promise((resolve, reject) => {
      let json = this.helperFunctions.ObjectToJSON(event);
      console.log(json);
      this.httpClient.put(environment.api_base_uri + "v1/user/" + this.userService.getUserId() + "/event/" + event.id, json, { headers: this.helperFunctions.getHttpHeaders() }).subscribe(
        (data: IEvent) => {
          data = _this.helperFunctions.jsonDateToJsDate(data);
          console.log("PUT Request is successful ", data);

          let event = _this.events.find((event) => event.id == data.id);
          event.accesstoken = data.accesstoken;
          event.description = data.description;
          event.end_date = data.end_date;
          event.name = data.name;
          event.place = data.place;
          event.link = data.link;
          event.start_date = data.start_date
          event.count_unread_messages = Number(data.count_unread_messages);
          event.last_read_message = data.last_read_message;

          resolve(event);
        },
        (error: HttpErrorResponse) => {
          console.log("Error", error);
          this.authService.checkErrorAndCreateToken(error.status)
            .then(() => {
              this.updateEvent(event)
                .then((data) => resolve(data))
                .catch((err) => reject(error))
            })
            .catch(() => {
              reject(error);
            })
        });
    });
  }

  joinEvent(event_id: any, access_token: any) {
    let _this = this;
    return new Promise((resolve, reject) => {
      this.httpClient.put(environment.api_base_uri + "v1/event/" + event_id + "/user/" + this.userService.getUserId() + "?accesstoken=" + access_token, {}).subscribe(
        (event: IEvent) => {
          console.log("PUT Request is successful ", event);
          event = _this.helperFunctions.jsonDateToJsDate(event);
          event.count_unread_messages = Number(event.count_unread_messages);

          _this.events.push(event);
          _this.socketService.subscribeEvent(event.id);
          resolve(event);
        },
        (error: HttpErrorResponse) => {
          console.log("Error", error);
          this.authService.checkErrorAndCreateToken(error.status)
            .then(() => {
              this.joinEvent(event_id, access_token)
                .then((data) => resolve(data))
                .catch((err) => reject(error))
            })
            .catch(() => {
              reject(error);
            })
        });
    });
  }

  leaveEvent(event_id) {
    let _this = this;
    return new Promise((resolve, reject) => {
      this.httpClient.delete(environment.api_base_uri + "v1/event/" + event_id + "/user/" + this.userService.getUserId(), {}).subscribe(
        data => {
          console.log("DELETE Request is successful ", data);
          _this.events = _this.events.filter((event) => event.id != event_id);
          console.log(_this.events);
          _this.socketService.unsubscribeEvent(event_id);
          resolve();
        },
        (error: HttpErrorResponse) => {
          console.log("Error", error);
          this.authService.checkErrorAndCreateToken(error.status)
            .then(() => {
              this.leaveEvent(event_id)
                .then(() => resolve())
                .catch((err) => reject(err))
            })
            .catch(() => {
              reject(error);
            })
        });
    });
  }

  increaseUnreadMessagesCount(event_id: number) {
    let foundElement = this.events.find((event) => event.id = event_id);
    foundElement.count_unread_messages++;
  }
}
