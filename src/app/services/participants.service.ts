import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParticipantsService {

  constructor(private httpClient: HttpClient ) { }

  async getParticipants(event_id: any) {
    let data = await this.httpClient.get(environment.api_base_uri + "v1/event/" + event_id + "/participants/", {}).toPromise();
    console.debug("Get Request is successful ", data);
    return data;
  }
}
