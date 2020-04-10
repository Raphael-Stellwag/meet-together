import { Injectable } from '@angular/core';
import { IEvent } from '../interfacese/ievent';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  events: IEvent[] = [];
  notifier = null;

  constructor() {
  }

  getEvents() {
    return this.events;
  }

  addEvent(event: IEvent) {
    this.events.push(event);
    if (this.notifier != null) {
      this.notifier(this.events);
    }
  }

  notifyWhenChanged() {
    return new Promise((resolve, reject) => {
      this.notifier = resolve;
    })
  }
}
