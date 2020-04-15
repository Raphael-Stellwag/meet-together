import { Injectable } from '@angular/core';
import { IEvent } from '../interfaces/ievent';
import { UserService } from './user.service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { element } from 'protractor';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  events: IEvent[] = [];
  notifier = null;

  constructor(private userService: UserService, private httpClient: HttpClient, private authService: AuthService) {
  }

  getEvents(): Promise<IEvent[]> {
    return new Promise<IEvent[]>((resolve, reject) => {
      if (this.userService.getUserId() != null) {
        this.httpClient.get("http://localhost:9000/v1/user/" + this.userService.getUserId() + "/event").subscribe(
          (data: IEvent[]) => {
            console.log("GET Request is successful ", data);
            this.events.splice(0, this.events.length);
            data.forEach((element) => {
              this.events.push(this.dataToEvent(element));
            });
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
    let ret_event;
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
      let json = JSON.stringify(event, (key, value) => {
        if (value !== null) return value
      })
      console.log(json);
      this.httpClient.post("http://localhost:9000/v1/user/" + this.userService.getUserId() + "/event", json, { headers: this.getHttpHeaders() }).subscribe(
        data => {
          console.log("POST Request is successful ", data);

          _this.events.push(_this.dataToEvent(data));
          if (this.notifier != null) {
            this.notifier(this.events);
          }
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
      let json = JSON.stringify(event, (key, value) => {
        if (value !== null) return value
      })
      console.log(json);
      this.httpClient.put("http://localhost:9000/v1/user/" + this.userService.getUserId() + "/event/" + event.id, json, { headers: this.getHttpHeaders() }).subscribe(
        (data: IEvent) => {
          console.log("PUT Request is successful ", data);
          _this.events.forEach((event) => {
            if (event.id == data.id) {
              _this.events.splice(_this.events.indexOf(event), 1);
            }
          })
          _this.events.push(_this.dataToEvent(data));
          if (this.notifier != null) {
            this.notifier(this.events);
          }
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

  private dataToEvent(data) {
    let event: IEvent = data as IEvent;
    if (event.start_date != null)
      event.start_date = new Date(event.start_date);
    if (event.end_date != null)
      event.end_date = new Date(event.end_date);
    return event;
  }

  joinEvent(event_id: any, access_token: any) {
    let _this = this;
    return new Promise((resolve, reject) => {
      this.httpClient.put("http://localhost:9000/v1/event/" + event_id + "/user/" + this.userService.getUserId() + "?accesstoken=" + access_token, {}).subscribe(
        data => {
          console.log("PUT Request is successful ", data);
          let event: IEvent = data as IEvent;
          _this.events.push(event);
          if (this.notifier != null) {
            this.notifier(this.events);
          }
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

  private getHttpHeaders() {
    return new HttpHeaders()
      .set('content-type', 'application/json')
  }

  notifyWhenChanged() {
    return new Promise((resolve, reject) => {
      this.notifier = resolve;
    })
  }
}
