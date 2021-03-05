import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private httpClient: HttpClient) { }

  async sendEmail(event_id: string, recipients: string[], subject: string, html5_content: any) {
      let json = {
        'recipients': recipients,
        'subject': subject,
        'html_content': html5_content
      };
      return await this.httpClient.post(environment.api_base_uri + "v1/event/" + event_id + "/mail", json).toPromise();
  }
}
