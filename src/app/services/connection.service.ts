import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {


  constructor(private httpClient: HttpClient) {
  }

  async testConnection() {
    await this.httpClient.get(environment.api_base_uri + "v1/ping").toPromise();
  }
}