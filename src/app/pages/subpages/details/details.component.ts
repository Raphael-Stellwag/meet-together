import { Component, OnInit } from '@angular/core';
import { IEvent } from 'src/app/interfaces/ievent';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { HelperFunctionsService } from 'src/app/services/helper-functions.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  event: IEvent = {} as IEvent;
  time = ""

  constructor(private actRoute: ActivatedRoute, private router: Router, private eventService: EventService, private helperFunctions: HelperFunctionsService) { }

  ngOnInit(): void {
    this.actRoute.snapshot.pathFromRoot.forEach((element: ActivatedRouteSnapshot) => {
      console.log(element);
      if (element.params.id != undefined && element.params.id != null) {
        console.log(element.params.id);
        this.event.id = element.params.id;
      }
    })
    console.log(this.event.id)
    this.eventService.getEvent(this.event.id)
      .then((event: IEvent) => {
        this.event = event;
        if (event.start_date != null) {
          this.time = this.helperFunctions.printDate(event.start_date);
          if (event.end_date != null) {
            this.time = this.time + " - " + this.helperFunctions.printEndDate(event.end_date, event.start_date);
          }
        }
      })
  }

  linkClicked() {
    console.log("link clicked")
  }

  leaveEvent() {
    this.eventService.leaveEvent(this.event.id)
      .then(() => {
        this.router.navigate(['home'])
      })
  }

}
