import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import {EventService} from "../../services/event.service";
import {IEvent} from "../../interfaces/ievent";

@Injectable({
  providedIn: 'root'
})
export class HomeResolver implements Resolve<Promise<IEvent[]>> {

  constructor(private eventService: EventService) {
  }

  resolve(): Promise<IEvent[]> {
    return this.eventService.getEvents();
  }
}
