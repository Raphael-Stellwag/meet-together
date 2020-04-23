import { Injectable } from '@angular/core';
import { IEvent } from '../interfaces/ievent';
import { UserService } from './user.service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { element } from 'protractor';
import { AuthService } from './auth.service';
import { IUser } from '../interfaces/iuser';
import { ITimePlaceSuggestion } from '../interfaces/itime-place-suggestion';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  events: IEvent[] = [];
  notifiers = [];

  constructor(private userService: UserService, private httpClient: HttpClient, private authService: AuthService) {
  }

  getEvents(): Promise<IEvent[]> {
    return new Promise<IEvent[]>((resolve, reject) => {
      if (this.userService.getUserId() != null) {
        this.httpClient.get(environment.api_base_uri + "v1/user/" + this.userService.getUserId() + "/event").subscribe(
          (data: IEvent[]) => {
            console.log("GET Request is successful ", data);
            this.events.splice(0, this.events.length);
            data.forEach((element) => {
              this.events.push(this.jsonDateToJsDate(element));
            });
            this.notifiers.forEach((notifier) => {
              notifier(this.events);
            })
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
        let _this = this;
        this.getEvents().then((events: IEvent[]) => {
          resolve(_this.internalGetEvent(event_id));
        })

      } else {
        resolve(this.internalGetEvent(event_id));
      }
    })
  }

  internalGetEvent(event_id) {
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
      let json = this.ObjectToJSON(event);
      console.log(json);
      this.httpClient.post(environment.api_base_uri + "v1/user/" + this.userService.getUserId() + "/event", json, { headers: this.getHttpHeaders() }).subscribe(
        data => {
          console.log("POST Request is successful ", data);
          let event = _this.jsonDateToJsDate(data)
          _this.events.push(event);
          this.notifiers.forEach((notifier) => {
            notifier(this.events);
          })
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
      let json = this.ObjectToJSON(event);
      console.log(json);
      this.httpClient.put(environment.api_base_uri + "v1/user/" + this.userService.getUserId() + "/event/" + event.id, json, { headers: this.getHttpHeaders() }).subscribe(
        (data: IEvent) => {
          console.log("PUT Request is successful ", data);
          _this.events.forEach((event) => {
            if (event.id == data.id) {
              data = _this.jsonDateToJsDate(data);
              event.accesstoken = data.accesstoken;
              event.description = data.description;
              event.end_date = data.end_date;
              //event.flexible_time = data.flexible_time;
              event.name = data.name;
              event.place = data.place;
              event.link = data.link;
              event.start_date = data.start_date
            }
          })
          this.notifiers.forEach((notifier) => {
            notifier(this.events);
          })
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
        data => {
          console.log("PUT Request is successful ", data);
          let event: IEvent = data as IEvent;
          _this.events.push(event);
          this.notifiers.forEach((notifier) => {
            notifier(this.events);
          })
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

  getParticipants(event_id: any) {
    return new Promise((resolve, reject) => {
      this.httpClient.get(environment.api_base_uri + "v1/event/" + event_id + "/participants/", {}).subscribe(
        (data: any[]) => {
          console.log("Get Request is successful ", data);
          resolve(data);
        },
        (error: HttpErrorResponse) => {
          console.log("Error", error);
          this.authService.checkErrorAndCreateToken(error.status)
            .then(() => {
              this.getParticipants(event_id)
                .then((data) => resolve(data))
                .catch((err) => reject(error))
            })
            .catch(() => {
              reject(error);
            })
        });
    });
  }

  /*
  setFixDatePlaceSuggestion(timePlaceSuggestion: ITimePlaceSuggestion) {
    let _this = this;
    return new Promise((resolve, reject) => {
      _this.createTimePlaceSuggestion(timePlaceSuggestion)
        .then((createdTimePlaceSuggestion: ITimePlaceSuggestion) => {
          _this.setDatePlaceSuggestion(createdTimePlaceSuggestion.id)
            .then(() => {
              resolve();
            })
        })
    });
  }

  setDatePlaceSuggestion(id: number) {
    return new Promise((resolve, reject) => {
      this.httpClient.get("http://localhost:9000/v1/event/" + event_id + "/participants/", {}).subscribe(
        (data: any[]) => {
          console.log("Get Request is successful ", data);
          resolve(data);
        },
        (error: HttpErrorResponse) => {
          console.log("Error", error);
          this.authService.checkErrorAndCreateToken(error.status)
            .then(() => {
              this.getParticipants(event_id)
                .then((data) => resolve(data))
                .catch((err) => reject(error))
            })
            .catch(() => {
              reject(error);
            })
        });
    });
  }*/

  createTimePlaceSuggestion(eventId, timeplaceSuggestion: ITimePlaceSuggestion) {
    let _this = this;
    return new Promise((resolve, reject) => {
      let json = this.ObjectToJSON(timeplaceSuggestion);
      this.httpClient.post(environment.api_base_uri + "v1/event/" + eventId + "/time-place-suggestion/", json, { headers: this.getHttpHeaders() }).subscribe(
        (data: any[]) => {
          _this.addUserToTimePlaceSuggestion(eventId, data["id"])
            .then((data) => {
              resolve(_this.jsonDateToJsDate(data));
            })
        },
        (error: HttpErrorResponse) => {
          console.log("Error", error);
          this.authService.checkErrorAndCreateToken(error.status)
            .then(() => {
              this.createTimePlaceSuggestion(eventId, timeplaceSuggestion)
                .then((data) => resolve(data))
                .catch((err) => reject(error))
            })
            .catch(() => {
              reject(error);
            })
        });
    });
  }

  addUserToTimePlaceSuggestion(eventId, timePlaceSuggestionId) {
    let _this = this;
    return new Promise((resolve, reject) => {
      this.httpClient.put(environment.api_base_uri + "v1/event/" + eventId + "/time-place-suggestion/" + timePlaceSuggestionId + "/user/" + this.userService.getUserId(), {}).subscribe(
        (data: any[]) => {
          console.log("Get Request is successful ", data);
          resolve(_this.jsonDateToJsDate(data));
        },
        (error: HttpErrorResponse) => {
          console.log("Error", error);
          this.authService.checkErrorAndCreateToken(error.status)
            .then(() => {
              this.addUserToTimePlaceSuggestion(eventId, timePlaceSuggestionId)
                .then((data) => resolve(data))
                .catch((err) => reject(error))
            })
            .catch(() => {
              reject(error);
            })
        });
    });
  }

  removeUserFromTimePlaceSuggestion(event_id: number, suggestion_id: any) {
    let _this = this;
    return new Promise((resolve, reject) => {
      this.httpClient.delete(environment.api_base_uri + "v1/event/" + event_id + "/time-place-suggestion/" + suggestion_id + "/user/" + this.userService.getUserId(), {}).subscribe(
        (data: ITimePlaceSuggestion) => {
          console.log("Get Request is successful ", data);
          resolve(_this.jsonDateToJsDate(data));
        },
        (error: HttpErrorResponse) => {
          console.log("Error", error);
          this.authService.checkErrorAndCreateToken(error.status)
            .then(() => {
              this.removeUserFromTimePlaceSuggestion(event_id, suggestion_id)
                .then((data) => resolve(data))
                .catch((err) => reject(error))
            })
            .catch(() => {
              reject(error);
            })
        });
    });
  }

  getTimePlaceSuggestions(event_id: any) {
    let _this = this;
    return new Promise((resolve, reject) => {
      this.httpClient.get(environment.api_base_uri + "v1/event/" + event_id + "/time-place-suggestion/").subscribe(
        (data: ITimePlaceSuggestion[]) => {
          data.forEach((row: ITimePlaceSuggestion) => {
            row = _this.jsonDateToJsDate(row);
          })
          resolve(data);
        },
        (error: HttpErrorResponse) => {
          console.log("Error", error);
          this.authService.checkErrorAndCreateToken(error.status)
            .then(() => {
              this.getTimePlaceSuggestions(event_id)
                .then((data) => resolve(data))
                .catch((err) => reject(error))
            })
            .catch(() => {
              reject(error);
            })
        });
    });
  }

  suggestionChoosen(event_id: number, suggestion_id: any) {
    let _this = this;
    return new Promise((resolve, reject) => {
      let event: IEvent = _this.internalGetEvent(event_id);
      event.choosen_time_place = suggestion_id
      let json = this.ObjectToJSON(event);
      console.log(json);
      this.httpClient.put(environment.api_base_uri + "v1/event/" + event_id + "/time-place-suggestion/" + suggestion_id + "/user/" + this.userService.getUserId() + "/choosen", json, { headers: this.getHttpHeaders() }).subscribe(
        (data: IEvent) => {
          console.log("PUT Request is successful ", data);
          _this.events.forEach((event) => {
            if (event.id == data.id) {
              data = _this.jsonDateToJsDate(data);
              event.accesstoken = data.accesstoken;
              event.description = data.description;
              event.end_date = data.end_date;
              event.name = data.name;
              event.place = data.place;
              event.link = data.link;
              event.start_date = data.start_date;
              event.choosen_time_place = data.choosen_time_place;
            }
          })
          this.notifiers.forEach((notifier) => {
            notifier(this.events);
          })
          resolve(event);
        },
        (error: HttpErrorResponse) => {
          console.log("Error", error);
          this.authService.checkErrorAndCreateToken(error.status)
            .then(() => {
              this.suggestionChoosen(event_id, suggestion_id)
                .then((data) => resolve(data))
                .catch((err) => reject(error))
            })
            .catch(() => {
              reject(error);
            })
        });
    });
  }

  sendEmail(event_id, recipients: String[], subject: any, html5_content: any) {
    return new Promise((resolve, reject) => {
      let json = {
        'recipients': recipients,
        'subject': subject,
        'html_content': html5_content
      };
      this.httpClient.post(environment.api_base_uri + "v1/event/" + event_id + "/mail", json, { headers: this.getHttpHeaders() })
        .subscribe(
          (data) => {
            resolve(data);
          },
          (error: HttpErrorResponse) => {
            console.log("Error", error);
            this.authService.checkErrorAndCreateToken(error.status)
              .then(() => {
                this.sendEmail(event_id, recipients, subject, html5_content)
                  .then((data) => resolve(data))
                  .catch((err) => reject(error))
              })
              .catch(() => {
                reject(error);
              })
          });
    })
  }

  notifyWhenGotEvents() {
    return new Promise((resolve, reject) => {
      this.notifiers.push(resolve);
    })
  }

  private jsonDateToJsDate(data) {
    let event: IEvent = data as IEvent;
    if (event.start_date != null)
      event.start_date = new Date(event.start_date);
    if (event.end_date != null)
      event.end_date = new Date(event.end_date);
    return event;
  }

  private ObjectToJSON(data) {
    return JSON.stringify(data, (key, value) => {
      if (value !== null) return value
    })
  }

  private getHttpHeaders() {
    return new HttpHeaders()
      .set('content-type', 'application/json')
  }
}
