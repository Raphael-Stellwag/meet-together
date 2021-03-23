import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
