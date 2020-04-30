import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { HelperFunctionsService } from './helper-functions.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private httpClient: HttpClient, private authService: AuthService, private helperFunctions: HelperFunctionsService) { }

  sendEmail(event_id, recipients: String[], subject: any, html5_content: any) {
    return new Promise((resolve, reject) => {
      let json = {
        'recipients': recipients,
        'subject': subject,
        'html_content': html5_content
      };
      this.httpClient.post(environment.api_base_uri + "v1/event/" + event_id + "/mail", json, { headers: this.helperFunctions.getHttpHeaders() })
        .subscribe(
          (data) => {
            resolve(data);
          },
          (error: HttpErrorResponse) => {
            console.error("Error", error);
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
}
