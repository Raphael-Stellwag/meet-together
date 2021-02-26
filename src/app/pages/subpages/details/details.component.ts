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
  url_event_id: string;
  event: IEvent = {} as IEvent;
  time = ""

  constructor(private actRoute: ActivatedRoute, private router: Router, private eventService: EventService, private helperFunctions: HelperFunctionsService) { }

  async ngOnInit() {
    this.actRoute.snapshot.pathFromRoot.forEach((element: ActivatedRouteSnapshot) => {
      if (element.params.id != undefined && element.params.id != null) {
        this.url_event_id = element.params.id;
      }
    })
    this.event = await this.eventService.getEvent(this.url_event_id);

    if (this.event.start_date != null) {
      this.time = this.helperFunctions.printDate(this.event.start_date);
      if (this.event.end_date != null) {
        this.time = this.time + " - " + this.helperFunctions.printEndDate(this.event.end_date, this.event.start_date);
      }
    }
     
  }

  async leaveEvent() {
    await this.eventService.leaveEvent(this.event.id);
    this.router.navigate(['home'])  
  }

}
