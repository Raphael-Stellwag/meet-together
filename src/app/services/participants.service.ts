import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParticipantsService {

  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  getParticipants(event_id: any) {
    return new Promise((resolve, reject) => {
      this.httpClient.get(environment.api_base_uri + "v1/event/" + event_id + "/participants/", {}).subscribe(
        (data: any[]) => {
          console.debug("Get Request is successful ", data);
          resolve(data);
        },
        (error: HttpErrorResponse) => {
          console.warn("Error", error);
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
}
