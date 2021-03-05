import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  async createTimePlaceSuggestion(eventId, timeplaceSuggestion: ITimePlaceSuggestion) {
      let json = this.helperFunctions.ObjectToJSON(timeplaceSuggestion);
      let data: any[] = (await this.httpClient.post(environment.api_base_uri + "v1/event/" + eventId +
        "/time-place-suggestion/", json).toPromise()) as any[];

      let addedUser = await this.addUserToTimePlaceSuggestion(eventId, data["id"]);
      return this.helperFunctions.jsonDateToJsDate(addedUser);
  }

  async addUserToTimePlaceSuggestion(eventId, timePlaceSuggestionId) {
    let data: any[] = (await this.httpClient.put(environment.api_base_uri + "v1/event/" + eventId +
      "/time-place-suggestion/" + timePlaceSuggestionId + "/user", {}).toPromise()) as any[];

    console.debug("Get Request is successful ", data);
    return this.helperFunctions.jsonDateToJsDate(data);
  }

  async removeUserFromTimePlaceSuggestion(event_id: number, suggestion_id: any) {
    let data: ITimePlaceSuggestion = (await this.httpClient.delete(environment.api_base_uri + "v1/event/" + event_id +
      "/time-place-suggestion/" + suggestion_id + "/user", {}).toPromise()) as ITimePlaceSuggestion;

    console.debug("Get Request is successful ", data);
    return this.helperFunctions.jsonDateToJsDate(data);

  }

  async getTimePlaceSuggestions(event_id: any) {
    let data: ITimePlaceSuggestion[] = (await this.httpClient.get(environment.api_base_uri + "v1/event/" + event_id +
      "/time-place-suggestion/").toPromise()) as ITimePlaceSuggestion[];

    for (let i = 0; i < data.length; i++) {
      data[i] = this.helperFunctions.jsonDateToJsDate(data[i]);
    }

    return data;
  }


  async suggestionChoosen(event_id: number, suggestion_id: any) {
    let event = await this.eventService.getEvent(event_id)
    event.choosen_time_place = suggestion_id
    let json = this.helperFunctions.ObjectToJSON(event);
    let data: IEvent = await this.httpClient.put(environment.api_base_uri + "v1/event/" + event_id + "/time-place-suggestion/" +
      suggestion_id + "/choosen", json).toPromise() as IEvent;

    console.debug("PUT Request is successful ", data);
    data = this.helperFunctions.jsonDateToJsDate(data);

    event.accesstoken = data.accesstoken;
    event.description = data.description;
    event.end_date = data.end_date;
    event.name = data.name;
    event.place = data.place;
    event.link = data.link;
    event.start_date = data.start_date;
    event.choosen_time_place = data.choosen_time_place;

    return event;
  }
}
