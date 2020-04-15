import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { IEvent } from 'src/app/interfaces/ievent';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
  event: IEvent = {} as IEvent;
  opened = true;
  @ViewChild('sidenav', { static: true }) sidenav: MatSidenav;
  private static instance: EventComponent;

  constructor(private actRoute: ActivatedRoute, private eventService: EventService) {
    console.log("Event View initialised");
    EventComponent.instance = this;
  }

  static getInstance() {
    return EventComponent.instance;
  }

  refreshEvent() {
    this.ngOnInit();
  }

  ngOnInit() {
    let event_id = this.actRoute.snapshot.params.id;
    this.eventService.getEvent(event_id).then((event) => {
      this.event = event;
    })
    console.log(window.innerWidth)
    if (window.innerWidth < 768) {
      this.sidenav.fixedTopGap = 55;
      this.opened = false;
    } else {
      this.sidenav.fixedTopGap = 55;
      this.opened = true;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth < 768) {
      this.sidenav.fixedTopGap = 55;
      this.opened = false;
    } else {
      this.sidenav.fixedTopGap = 55
      this.opened = true;
    }
  }

  isBiggerScreen() {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (width < 768) {
      return true;
    } else {
      return false;
    }
  }
}
