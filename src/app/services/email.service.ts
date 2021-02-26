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

  async sendEmail(event_id, recipients: String[], subject: any, html5_content: any) {
      let json = {
        'recipients': recipients,
        'subject': subject,
        'html_content': html5_content
      };
      let result =  await this.httpClient.post(environment.api_base_uri + "v1/event/" + event_id + "/mail", json, 
                        { headers: this.helperFunctions.getHttpHeaders() }).toPromise();
      return result;
  }
}
