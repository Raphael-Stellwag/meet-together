import { Component, OnInit } from '@angular/core';
import { IEvent } from 'src/app/interfaces/ievent';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { OutputWriterService } from 'src/app/services/output-writer.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  event: IEvent = {} as IEvent;
  time = ""

  constructor(private actRoute: ActivatedRoute, private eventService: EventService, private outputWriter: OutputWriterService) { }

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
          this.time = this.outputWriter.printDate(event.start_date);
          if (event.end_date != null) {
            this.time = this.time + " - " + this.outputWriter.printEndDate(event.end_date, event.start_date);
          }
        }
      })
  }

  linkClicked() {
    console.log("link clicked")
  }

}
