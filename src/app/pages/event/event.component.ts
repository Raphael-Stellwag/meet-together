import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { IEvent } from 'src/app/interfaces/ievent';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

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
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private actRoute: ActivatedRoute, private router: Router, private eventService: EventService, private breakpointObserver: BreakpointObserver) {
    EventComponent.instance = this;
  }

  static getInstance() {
    return EventComponent.instance;
  }

  toggleMenu($event) {
    this.sidenav.fixedInViewport = true;
    this.sidenav.toggle();
  }

  closeMenu($event) {
    //Close the menu on mobile devices
    if (this.sidenav.mode == "over") {
      this.sidenav.close()
    }
  }

  refreshEvent() {
    this.ngOnInit();
  }

  ngOnInit() {
    let event_id = this.actRoute.snapshot.params.id;
    this.eventService.getEvent(event_id).then((event) => {
      if (event == null) {
        this.router.navigate(['home']);
      } else {
        this.event = event;
      }
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
