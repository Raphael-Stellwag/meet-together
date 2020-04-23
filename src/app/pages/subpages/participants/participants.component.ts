import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.scss']
})
export class ParticipantsComponent implements OnInit {
  participants: any[];

  constructor(private actRoute: ActivatedRoute, private eventService: EventService) { }

  ngOnInit(): void {
    let event_id;
    this.actRoute.snapshot.pathFromRoot.forEach((element: ActivatedRouteSnapshot) => {
      console.log(element);
      if (element.params.id != undefined && element.params.id != null) {
        console.log(element.params.id);
        event_id = element.params.id;
      }
    })
    console.log(event_id)
    this.eventService.getParticipants(event_id).then((participants: any[]) => {
      this.participants = participants
    })
  }

}
