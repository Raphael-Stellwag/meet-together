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
}
