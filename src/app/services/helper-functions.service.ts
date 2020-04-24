import { Injectable } from '@angular/core';
import { IEvent } from '../interfaces/ievent';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HelperFunctionsService {

  constructor() { }

  printDate(date: Date) {
    /*console.log(date.toLocaleString());
    console.log(date.toLocaleTimeString("de", { hour: '2-digit', minute: '2-digit' }));
    console.log(date);*/
    return date.toLocaleDateString("de") + " " + date.toLocaleTimeString("de", { hour: '2-digit', minute: '2-digit' });
  }

  printEndDate(date: Date, compareDate: Date) {
    /*console.log(date.toLocaleString());
    console.log(date.toLocaleTimeString("de", { hour: '2-digit', minute: '2-digit' }));
    console.log(date);*/
    if (compareDate != null) {
      if (date.getFullYear() == compareDate.getFullYear() && date.getMonth() == compareDate.getMonth() && date.getDate() == compareDate.getDate()) {
        return date.toLocaleTimeString("de", { hour: '2-digit', minute: '2-digit' });
      }
    }
    return date.toLocaleDateString("de") + " " + date.toLocaleTimeString("de", { hour: '2-digit', minute: '2-digit' });
  }


  jsonDateToJsDate(data) {
    let event: IEvent = data as IEvent;
    if (event.start_date != null)
      event.start_date = new Date(event.start_date);
    if (event.end_date != null)
      event.end_date = new Date(event.end_date);
    return event;
  }

  ObjectToJSON(data) {
    return JSON.stringify(data, (key, value) => {
      if (value !== null) return value
    })
  }

  getHttpHeaders() {
    return new HttpHeaders()
      .set('content-type', 'application/json')
  }
}