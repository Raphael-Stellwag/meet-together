import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { ParticipantsService } from 'src/app/services/participants.service';

@Component({
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.scss']
})
export class ParticipantsComponent implements OnInit {
  participants: any[];

  constructor(private actRoute: ActivatedRoute, private eventService: EventService, private participantsService: ParticipantsService) { }

  async ngOnInit() {
    let event_id;
    this.actRoute.snapshot.pathFromRoot.forEach((element: ActivatedRouteSnapshot) => {
      if (element.params.id != undefined) {
        event_id = element.params.id;
      }
    })
    this.participants = await this.participantsService.getParticipants(event_id) as any[];
  }

}
