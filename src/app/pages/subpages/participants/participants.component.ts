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

  constructor(private actRoute: ActivatedRoute) { }

  ngOnInit() {
    this.participants = this.actRoute.snapshot.data.participantData;
  }

}
