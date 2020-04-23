import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OutputWriterService {

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
}
