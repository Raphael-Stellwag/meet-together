import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ITimePlaceSuggestion } from '../interfaces/itime-place-suggestion';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { HelperFunctionsService } from './helper-functions.service';
import { IEvent } from '../interfaces/ievent';
import { EventService } from './event.service';

@Injectable({
  providedIn: 'root'
})
export class TimePlaceSuggestionService {

  constructor(private httpClient: HttpClient, private authService: AuthService, private userService: UserService, private helperFunctions: HelperFunctionsService, private eventService: EventService) { }

  createTimePlaceSuggestion(eventId, timeplaceSuggestion: ITimePlaceSuggestion) {
    let _this = this;
    return new Promise((resolve, reject) => {
      let json = this.helperFunctions.ObjectToJSON(timeplaceSuggestion);
      this.httpClient.post(environment.api_base_uri + "v1/event/" + eventId + "/time-place-suggestion/",
        json, { headers: this.helperFunctions.getHttpHeaders() }).subscribe(
          (data: any[]) => {
            _this.addUserToTimePlaceSuggestion(eventId, data["id"])
              .then((data) => {
                resolve(_this.helperFunctions.jsonDateToJsDate(data));
              })
          },
          (error: HttpErrorResponse) => {
            console.warn("Error", error);
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
      this.httpClient.put(environment.api_base_uri + "v1/event/" + eventId + "/time-place-suggestion/" + timePlaceSuggestionId + "/user", {}).subscribe(
        (data: any[]) => {
          console.debug("Get Request is successful ", data);
          resolve(_this.helperFunctions.jsonDateToJsDate(data));
        },
        (error: HttpErrorResponse) => {
          console.warn("Error", error);
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
      this.httpClient.delete(environment.api_base_uri + "v1/event/" + event_id + "/time-place-suggestion/" + suggestion_id + "/user", {}).subscribe(
        (data: ITimePlaceSuggestion) => {
          console.debug("Get Request is successful ", data);
          resolve(_this.helperFunctions.jsonDateToJsDate(data));
        },
        (error: HttpErrorResponse) => {
          console.warn("Error", error);
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
            row = _this.helperFunctions.jsonDateToJsDate(row);
          })
          resolve(data);
        },
        (error: HttpErrorResponse) => {
          console.warn("Error", error);
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
      _this.eventService.getEvent(event_id)
        .then((event) => {
          event.choosen_time_place = suggestion_id
          let json = this.helperFunctions.ObjectToJSON(event);
          this.httpClient.put(
            environment.api_base_uri + "v1/event/" + event_id + "/time-place-suggestion/" + suggestion_id + "/choosen",
            json, { headers: this.helperFunctions.getHttpHeaders() }).subscribe(
              (data: IEvent) => {
                console.debug("PUT Request is successful ", data);
                data = _this.helperFunctions.jsonDateToJsDate(data);
                event.accesstoken = data.accesstoken;
                event.description = data.description;
                event.end_date = data.end_date;
                event.name = data.name;
                event.place = data.place;
                event.link = data.link;
                event.start_date = data.start_date;
                event.choosen_time_place = data.choosen_time_place;
                resolve(event);
              },
              (error: HttpErrorResponse) => {
                console.warn("Error", error);
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
    });
  }
}
