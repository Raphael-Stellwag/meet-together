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
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private actRoute: ActivatedRoute, private router: Router, private eventService: EventService, private breakpointObserver: BreakpointObserver) {
  }

  //Open the menu on mobile devices
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

  ngOnInit() {
    let event_id = this.actRoute.snapshot.params.id;
    this.eventService.getEvent(event_id)
      .then((event) => {
        if (event == null) {
          this.router.navigate(['home']);
        } else {
          this.event = event;
        }
      })
      .catch((error) => console.error(error))

    if (window.innerWidth < 768) {
      this.sidenav.fixedTopGap = 55;
    } else {
      this.sidenav.fixedTopGap = 112;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth < 768) {
      this.sidenav.fixedTopGap = 56;
    } else {
      this.sidenav.fixedTopGap = 112
    }
  }
}
